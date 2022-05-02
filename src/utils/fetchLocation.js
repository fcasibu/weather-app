import regeneratorRuntime from 'regenerator-runtime';

async function fetchLocation(location) {
  try {
    const response = await fetch(
      `https://www.metaweather.com/api/location/search/?query=${location}`,
      {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
    const data = await response.json();
    const id = data[0].woeid;

    const newRes = await fetchFullInfo(id);
    const newData = await newRes.json();
    return newData;
  } catch (error) {
    return Promise.reject({ message: 'Invalid Location' });
  }
}

function fetchFullInfo(id) {
  return fetch(`https://www.metaweather.com/api/location/${id}`);
}

export default fetchLocation;
