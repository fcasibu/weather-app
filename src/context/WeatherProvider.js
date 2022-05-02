import React, { useEffect } from 'react';
import WeatherContext from './WeatherContext';
import useRequest from '../hooks/useRequest';

function WeatherProvider(props) {
  const state = useRequest();

  return <WeatherContext.Provider value={state} {...props} />;
}

export default WeatherProvider;
