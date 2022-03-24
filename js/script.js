const converters = (() => {
  const convertToCelsius = (temp) => {
    const celsius = Math.floor(Math.round(temp - 273.15));
    return `${celsius}°C`;
  };

  const convertToFahrenheit = (temp) => {
    const fahrenheit = Math.floor(Math.round(((temp - 273.15) * 9) / 5 + 32));
    return `${fahrenheit}°F`;
  };

  const convertToMph = (speed) => {
    const mph = Math.floor(Math.round(speed * 2.237));
    return `${mph} mph`;
  };

  const convertToKmh = (speed) => {
    const kmh = Math.floor(Math.round(speed * 3.6));
    return `${kmh} km/h`;
  };

  const convertToDay = (dt) => {
    const timeStamp = dt;

    const date = new Date(timeStamp * 1000);
    const getDay = date.getDay();

    const days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    };

    return days[`${getDay}`];
  };

  return {
    convertToCelsius,
    convertToFahrenheit,
    convertToMph,
    convertToKmh,
    convertToDay,
  };
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
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=6cc0c59c68dc28224314730ce15142aa`,
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
  const img = document.querySelectorAll(".logo");
  const minTemp = document.querySelectorAll(".min-temp");
  const maxTemp = document.querySelectorAll(".max-temp");
  const dailyDate = document.querySelectorAll(".daily-date");
  const currentConditions = document.querySelectorAll(
    ".item > .item-condition"
  );

  const {
    convertToCelsius,
    convertToFahrenheit,
    convertToMph,
    convertToKmh,
    convertToDay,
  } = converters;

  const changeImg = (daily) => {
    for (let i = 0; i < img.length; i++) {
      const { weather } = daily[i];
      const icon = weather[0].icon;
      img[i].src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    }
  };

  const changeWeatherTitle = ({ weather }) => {
    weatherConditionTitle.textContent = weather[0].description;
    weatherConditionTitle.style.textTransform = "capitalize";
  };

  const changeLocationName = (name, country) => {
    locationName.textContent = `${name}, ${country}`;
  };

  const changeCurrentDate = (data) => {
    const {
      current: { sunrise },
      timezone_offset: timeZoneOffset,
    } = data;

    const date = new Date((sunrise + timeZoneOffset) * 1000).toLocaleDateString(
      "en-US"
    );
    currentDate.textContent = date;
  };

  const changeCurrentTemp = ({ temp }) => {
    const celsius = convertToCelsius(temp);
    const fahrenheit = convertToFahrenheit(temp);
    currentTemperature.textContent = tempConversion.checked
      ? celsius
      : fahrenheit;
    tempConversion.addEventListener("change", () => {
      const isChecked = tempConversion.checked ? celsius : fahrenheit;
      currentTemperature.textContent = isChecked;
      currentConditions[0].textContent = isChecked;
    });
  };

  const changeCurrentConditionImg = ({ weather }) => {
    const icon = weather[0].icon;
    currentConditionImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const changeCurrentConditions = (current) => {
    const { feels_like: feelsLike, humidity, wind_speed: windSpeed } = current;
    const celsius = convertToCelsius(feelsLike);
    const fahrenheit = convertToFahrenheit(feelsLike);
    const mph = convertToMph(windSpeed);
    const kmh = convertToKmh(windSpeed);
    const temp = tempConversion.checked ? celsius : fahrenheit;
    const speed = tempConversion.checked ? kmh : mph;
    const conditions = [temp, `${humidity}%`, "0%", speed];
    for (let i = 0; i < currentConditions.length; i++) {
      currentConditions[i].textContent = conditions[i];
    }
    tempConversion.addEventListener("change", () => {
      const isChecked = tempConversion.checked ? kmh : mph;
      currentConditions[currentConditions.length - 1].textContent = isChecked;
    });
  };

  const changeDailyTemp = (daily, tempState) => {
    const getSelector = tempState === "min" ? minTemp : maxTemp;
    for (let i = 0; i < img.length; i++) {
      const state = daily[i].temp[`${tempState}`];
      const day = convertToDay(daily[i + 1].dt);
      dailyDate[i].textContent = day;
      const celsius = convertToCelsius(state);
      const fahrenheit = convertToFahrenheit(state);
      getSelector[i].textContent = tempConversion.checked
        ? celsius
        : fahrenheit;

      tempConversion.addEventListener("change", () => {
        const isChecked = tempConversion.checked ? celsius : fahrenheit;
        getSelector[i].textContent = isChecked;
      });
    }
  };

  const changeWeatherInfo = (data) => {
    changeWeatherTitle(data);
    changeCurrentTemp(data);
    changeCurrentConditionImg(data);
    changeCurrentConditions(data);
  };

  return {
    changeImg,
    changeWeatherInfo,
    changeLocationName,
    changeDailyTemp,
    changeCurrentDate,
  };
})();

const helpers = (() => {
  const {
    changeImg,
    changeWeatherInfo,
    changeLocationName,
    changeDailyTemp,
    changeCurrentDate,
  } = dom;

  const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(`City not found ${res.status}`);
  };

  const getData = (data) => {
    console.log(data);
    return data;
  };

  const getCountryAndCity = ({ name, sys: { country }, coord }) => {
    changeLocationName(name, country);
    return coord;
  };

  const getCoords = ({ lat, lon }) => {
    return { lat, lon };
  };

  const getCurrentForecast = (data) => {
    const { current } = data;
    const info = current.weather[0];
    changeCurrentDate(data);
    changeWeatherInfo(current);
    return data;
  };

  const getHourlyForecast = (data) => {
    const { hourly } = data;
    return data;
  };

  const getDailyForecast = (data) => {
    const { daily } = data;
    dom.changeImg(daily);
    changeDailyTemp(daily, "min");
    changeDailyTemp(daily, "max");
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

  fetchLocation("tokyo")
    .then(checkResponse)
    .then(getData)
    .then(getCountryAndCity)
    .then(getCoords)
    .then(fetchForecast)
    .then(checkResponse)
    .then(getData)
    .then(getCurrentForecast)
    .then(getDailyForecast)
    .catch((err) => {
      console.log(err);
    });

  button.addEventListener("click", (e) => {
    e.preventDefault();

    fetchLocation(input.value)
      .then(checkResponse)
      .then(getData)
      .then(getCountryAndCity)
      .then(getCoords)
      .then(fetchForecast)
      .then(checkResponse)
      .then(getData)
      .then(getCurrentForecast)
      .then(getDailyForecast)
      .catch((err) => {
        console.log(err);
      });
  });
})();
