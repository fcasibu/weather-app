import regeneratorRuntime from 'regenerator-runtime';

async function fetchLocation(location) {
  try {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://www.metaweather.com/api/location/search/?query=${location}`
      )}`
    );
    const data = await response.json();
    const contents = JSON.parse(data.contents);
    const id = contents[0].woeid;

    const newRes = await fetchFullInfo(id);
    const newData = await newRes.json();
    const newContents = JSON.parse(newData.contents);
    return newContents;
  } catch (error) {
    return Promise.reject({ message: 'Invalid Location' });
  }
}

function fetchFullInfo(id) {
  return fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.metaweather.com/api/location/${id}`
    )}`
  );
}

export default fetchLocation;
