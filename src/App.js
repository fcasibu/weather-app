import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useWeather from './hooks/useWeather';
import fetchLocation from './utils/fetchLocation';

import { ErrorBoundary } from 'react-error-boundary';
import WeatherProvider from './context/WeatherProvider';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import FallbackErrorComponent from './components/FallbackErrorComponent';
import FormDrawer from './components/FormDrawer';
import './styles/App.css';

function LocationInfo({ location, openDrawer }) {
  const {
    status,
    error,
    data,
    setData,
    requestData,
    cache,
    cacheDispatch: dispatch
  } = useWeather();

  useEffect(() => {
    if (!location) return;
    if (cache[location]) {
      setData(cache[location]);
    } else {
      requestData(
        fetchLocation(location).then(data => {
          dispatch({ type: 'ADD_LOCATION', location, data });
          return data;
        })
      );
    }
  }, [location, requestData, dispatch, setData]);

  if (status === 'pending') {
    return <img src={'./images/loading.svg'} className="loading-state" />;
  } else if (status === 'rejected') {
    throw error;
  } else if (status === 'resolved') {
    return (
      <div className="container">
        <Sidebar data={data} openDrawer={openDrawer} />
        <Main data={data} setData={setData} />
      </div>
    );
  }
}

function App() {
  const [location, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function closeDrawer() {
    setIsOpen(!isOpen);
  }

  function openDrawer() {
    setIsOpen(!isOpen);
  }

  function changeLocation(name) {
    setLocation(name.toLowerCase());
  }

  return (
    <>
      <ErrorBoundary
        FallbackComponent={FallbackErrorComponent}
        onReset={changeLocation}
        resetKeys={[location]}
      >
        <WeatherProvider>
          {isOpen &&
            ReactDOM.createPortal(
              <FormDrawer
                closeDrawer={closeDrawer}
                changeLocation={changeLocation}
              />,
              document.getElementById('drawer')
            )}
          <LocationInfo
            location={location || 'tokyo'}
            openDrawer={openDrawer}
          />
        </WeatherProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
