function convertToCelsius(temp) {
  return ((temp - 32) * 5) / 9;
}

function convertToFahrenheit(temp) {
  return temp * (9 / 5) + 32;
}

export { convertToFahrenheit, convertToCelsius };
