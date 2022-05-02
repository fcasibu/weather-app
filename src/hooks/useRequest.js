import { useReducer, useCallback } from 'react';

function requestReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return { status: 'pending', data: null, error: null };
    }
    case 'resolved': {
      return { status: 'resolved', data: action.data, error: null };
    }
    case 'rejected': {
      return { status: 'rejected', data: null, error: action.error };
    }
    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
}

function cacheReducer(state, action) {
  switch (action.type) {
    case 'ADD_LOCATION': {
      return { ...state, [action.location]: action.data };
    }
    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
}

function useRequest() {
  const [state, dispatch] = useReducer(requestReducer, {
    status: 'idle',
    data: null,
    error: null
  });
  const [cache, cacheDispatch] = useReducer(cacheReducer, {});

  const requestData = useCallback(
    promise => {
      dispatch({ type: 'pending' });
      promise.then(
        data => {
          dispatch({ type: 'resolved', data });
        },
        error => dispatch({ type: 'rejected', error })
      );
    },
    [dispatch]
  );

  const setData = useCallback(
    data => {
      dispatch({ type: 'resolved', data });
    },
    [dispatch]
  );
  return { ...state, requestData, setData, cache, cacheDispatch };
}

export default useRequest;
