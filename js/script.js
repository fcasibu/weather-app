const converters = (() => {
  const convertToCelsius = (temp) => {
    return Math.floor(Math.round(temp - 273.15));
  };

  const convertToFahrenheit = (temp) => {
    return Math.floor(Math.round(((temp - 273.15) * 9) / 5 + 32));
  };

  const convertToMph = (speed) => {
    return Math.floor(Math.round(speed * 2.237));
  };

  const convertToKmh = (speed) => {
    return Math.floor(Math.round(speed * 3.6));
  };

  return { convertToCelsius, convertToFahrenheit, convertToMph, convertToKmh };
})();

const dataFetcher = (() => {
  const fetchLocation = (location) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=6cc0c59c68dc28224314730ce15142aa`,
      { mode: "cors" }
    );
  };

  const fetchForecast = ({ lat, lon }) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=6cc0c59c68dc28224314730ce15142aa`,
      { mode: "cors" }
    );
  };

  return { fetchLocation, fetchForecast };
})();

const dom = (() => {
  const weatherConditionTitle = document.querySelector(".weather-condition");
  const locationName = document.querySelector(".location");
  const currentDate = document.querySelector(".date");
  const currentTemperature = document.querySelector("h2.temperature");
  const currentConditionImg = document.querySelector(".current-condition-img");
  const tempConversion = document.querySelector("#temp-conversion");
  const currentConditions = document.querySelectorAll(
    ".item > .item-condition"
  );

  const { convertToCelsius, convertToFahrenheit, convertToMph, convertToKmh } =
    converters;

  const changeImg = (daily) => {
    for (let i = 0; i < daily.length; i++) {
      const { weather } = daily[i];
      const icon = weather[0].icon;
      img[i].src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    }
  };

  const changeWeatherTitle = ({ weather }) => {
    weatherConditionTitle.textContent = weather[0].description;
    weatherConditionTitle.style.textTransform = "capitalize";
  };

  const changeLocationName = ({ name }) => {
    locationName.textContent = name;
  };

  const changeCurrentDate = ({ dt }) => {
    const timeStamp = dt;

    const date = new Date(timeStamp * 1000).toLocaleDateString("en-US");
    currentDate.textContent = date;
  };

  const changeCurrentTemp = ({ main: { temp } }) => {
    const celsius = convertToCelsius(temp);
    const fahrenheit = convertToFahrenheit(temp);
    currentTemperature.textContent = `${celsius}°C`;
    tempConversion.addEventListener("change", () => {
      const isChecked = tempConversion.checked
        ? `${celsius}°C`
        : `${fahrenheit}°F`;
      currentTemperature.textContent = isChecked;
      currentConditions[0].textContent = isChecked;
    });
  };

  const changeCurrentConditionImg = ({ weather }) => {
    const icon = weather[0].icon;
    currentConditionImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const changeCurrentConditions = ({ main, wind: { speed } }) => {
    const { feels_like: feelsLike, humidity } = main;
    const celsius = convertToCelsius(feelsLike);
    const conditions = [`${celsius}°C`, `${humidity}%`, "0%", "0"];
    for (let i = 0; i < currentConditions.length; i++) {
      currentConditions[i].textContent = conditions[i];
    }
  };

  const changeWeatherInfo = (data) => {
    changeWeatherTitle(data);
    changeLocationName(data);
    changeCurrentDate(data);
    changeCurrentTemp(data);
    changeCurrentConditionImg(data);
    changeCurrentConditions(data);
  };

  return { changeImg, changeWeatherInfo };
})();

const helpers = (() => {
  const { changeImg, changeWeatherInfo } = dom;

  const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(`City not found ${res.status}`);
  };

  const getData = (data) => {
    console.log(data);
    changeWeatherInfo(data);
    return data;
  };

  const getCountryAndCity = ({ name, sys: { country }, coord }) => {
    console.log(name, country);
    return coord;
  };

  const getCoords = ({ lat, lon }) => {
    return { lat, lon };
  };

  const getCurrentForecast = (data) => {
    const { current } = data;
    const info = current.weather[0];
    return data;
  };

  const getHourlyForecast = (data) => {
    const { hourly } = data;
    return data;
  };

  const getDailyForecast = (data) => {
    const { daily } = data;
    dom.changeImg(daily);
    return data;
  };

  return {
    checkResponse,
    getData,
    getCountryAndCity,
    getCoords,
    getCurrentForecast,
    getHourlyForecast,
    getDailyForecast,
  };
})();

const weatherModule = (() => {
  const button = document.querySelector(".find-location");
  const input = document.querySelector("#location-search");

  const { fetchLocation, fetchForecast } = dataFetcher;
  const {
    checkResponse,
    getData,
    getCountryAndCity,
    getCoords,
    getCurrentForecast,
    getHourlyForecast,
    getDailyForecast,
  } = helpers;

  fetchLocation("Tokyo")
    .then(checkResponse)
    .then(getData)
    .then(getCountryAndCity)
    .then(getCoords)
    // .then(fetchForecast)
    // .then(checkResponse)
    // .then(getData)
    // .then(getCurrentForecast)
    // .then(getDailyForecast)
    // .then(getHourlyForecast)
    .catch((err) => {
      console.log(err);
    });

  button.addEventListener("click", (e) => {
    e.preventDefault();

    fetchLocation(input.value)
      .then(checkResponse)
      .then(getData)
      // .then(getCountryAndCity)
      // .then(getCoords)
      // .then(fetchForecast)
      // .then(checkResponse)
      // .then(getData)
      // .then(getCurrentForecast)
      // .then(getDailyForecast)
      // .then(getHourlyForecast)
      .catch((err) => {
        console.log(err);
      });
  });
})();
