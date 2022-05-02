import { useContext } from 'react';
import WeatherContext from '../context/WeatherContext';

function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather should be used inside a WeatherProvider');
  }

  return context;
}

export default useWeather;
