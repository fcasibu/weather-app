import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import formatDate from '../utils/formatDate';
import '../styles/Sidebar.css';

function Sidebar({ data: weatherData, openDrawer }) {
  const data = weatherData.consolidated_weather[0];

  const image = data.weather_state_name.split(' ').join('');

  const formattedDate = formatDate(weatherData.time);
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="sidebar-search-btn" onClick={openDrawer}>
          Search for places
        </button>
      </div>
      <div className="sidebar-weather">
        <img className="sidebar-clouds" src="./images/Cloud-background.png" />
        <div className="sidebar-weather-logo">
          <img src={`./images/${image}.png`} />
        </div>
      </div>
      <div className="sidebar-weather-temp">
        <h1>
          {Math.floor(data.the_temp)}
          <span>°{data.tempSymbol || 'C'}</span>
        </h1>
      </div>
      <div className="sidebar-weather-state">
        <h2>{data.weather_state_name}</h2>
      </div>
      <div className="sidebar-weather-info">
        <div className="date">Today | {formattedDate}</div>
        <div className="location">
          <FaMapMarkerAlt />
          {weatherData.title}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
