import React, { useEffect, useState } from 'react';
import formatDate from '../utils/formatDate';
import { convertToCelsius, convertToFahrenheit } from '../utils/tempConverter';
import { FaLocationArrow } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import '../styles/Main.css';

function changeTemp(tempName, dataCopy) {
  dataCopy.forEach(el => {
    if (tempName === 'fahrenheit') {
      el.max_temp = convertToFahrenheit(el.max_temp);
      el.min_temp = convertToFahrenheit(el.min_temp);
      el.the_temp = convertToFahrenheit(el.the_temp);
      el.tempSymbol = `F`;
    } else {
      el.max_temp = convertToCelsius(el.max_temp);
      el.min_temp = convertToCelsius(el.min_temp);
      el.the_temp = convertToCelsius(el.the_temp);
      el.tempSymbol = 'C';
    }
  });
}

const Main = React.memo(function Main({ data, setData }) {
  const dataToday = data.consolidated_weather[0];
  const dataWeekly = data.consolidated_weather.slice(1);
  const [isClicked, setIsClicked] = useState(true);

  useEffect(() => {
    console.log(dataToday);
    if (!dataToday.tempSymbol || dataToday.tempSymbol === 'C') {
      setIsClicked(true);
    } else if (dataToday.tempSymbol === 'F') {
      setIsClicked(false);
    }
  }, [data]);

  function handleTempChange(event) {
    const tempName = event.target.id;
    const dataCopy = [...data.consolidated_weather];
    changeTemp(tempName, dataCopy);
    setData({ ...data, ...dataCopy });
  }

  function renderWeeklyData() {
    return dataWeekly.map((weather, index) => {
      const date = new Date(weather.applicable_date).toISOString();
      const image = weather.weather_state_name.split(' ').join('');
      return (
        <div key={index} className="weekly-card">
          <h2>{index === 0 ? 'Tomorrow' : formatDate(date)}</h2>
          <img src={`./images/${image}.png`} />
          <div>
            <span className="max">
              {Math.floor(weather.max_temp)}°{weather.tempSymbol || 'C'}
            </span>
            <span className="min">
              {Math.floor(weather.min_temp)}°{weather.tempSymbol || 'C'}
            </span>
          </div>
        </div>
      );
    });
  }

  function renderHighlight() {
    console.log(dataToday.wind_direction);
    return (
      <>
        <div className="highlight-card">
          <div>Wind status</div>
          <h2>
            {Math.floor(dataToday.wind_speed)}
            <span>mph</span>
          </h2>
          <IconContext.Provider
            value={{
              style: {
                transform: `rotate(${dataToday.wind_direction - 40}deg)`
              },
              className: 'wind-direction-arrow'
            }}
          >
            <div className="wind">
              <div className="wind-direction">
                <FaLocationArrow />
              </div>
              <p> {dataToday.wind_direction_compass}</p>
            </div>
          </IconContext.Provider>
        </div>
        <div className="highlight-card">
          <div>Humidity</div>
          <h2>
            {Math.floor(dataToday.humidity)}
            <span>%</span>
          </h2>
          <div className="progress-bar">
            <div className="progress-label">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            <progress value={Math.floor(dataToday.humidity)} max="100" />
          </div>
        </div>
        <div className="highlight-card">
          <div>Visibility</div>
          <h2>
            {Math.floor(dataToday.visibility)}
            <span>miles</span>
          </h2>
        </div>
        <div className="highlight-card">
          <div>Air Pressure</div>
          <h2>
            {Math.floor(dataToday.air_pressure)}
            <span>mb</span>
          </h2>
        </div>
      </>
    );
  }

  return (
    <main>
      <div className="temp-converters">
        <button disabled={isClicked} id="celsius" onClick={handleTempChange}>
          °C
        </button>
        <button
          disabled={!isClicked}
          id="fahrenheit"
          onClick={handleTempChange}
        >
          °F
        </button>
      </div>
      <div className="weekly-cards">{renderWeeklyData()}</div>
      <div className="highlights">
        <h2>Today's Highlights</h2>
        <div className="highlight-cards">{renderHighlight()}</div>
      </div>
    </main>
  );
});

export default Main;
