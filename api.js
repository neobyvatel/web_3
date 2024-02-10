const axios = require("axios");
const WEATHER_API_KEY = "e31236ca2959caf5178b8298a93073e8";
const POLYGONIO_API_KEY = "ZLmqRJ8Hx6JTQQIVvjeZ3a0mVLLNrQtM";

async function getWeatherByCity(city) {
  let response,
    responseData = null;
  try {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${WEATHER_API_KEY}`
    );
    responseData = response?.data;
  } catch {
    return null;
  }

  if (!responseData) {
    return null;
  }

  if (responseData.cod !== 200) {
    return null;
  }

  return {
    latitude: responseData.coord.lat,
    longitude: responseData.coord.lon,
    description: responseData.weather[0].description,
    temperature: Math.floor(responseData.main.temp),
    feels_like: responseData.main.feels_like,
    pressure: responseData.main.pressure,
    maximum_temperature: Math.floor(responseData.main.temp_max),
    minimum_temperature: Math.floor(responseData.main.temp_min),
    humidity: responseData.main.humidity,
    wind_speed: responseData.wind.speed,
    wind_deg: responseData.wind.deg,
    cloudiness: responseData.clouds.all,
    sunrise: new Date(responseData.sys.sunrise * 1000).toLocaleTimeString(
      "en-GB",
      { hour: "2-digit", minute: "2-digit" }
    ),
    sunset: new Date(responseData.sys.sunset * 1000).toLocaleTimeString(
      "en-GB",
      { hour: "2-digit", minute: "2-digit" }
    ),
    name: responseData.name,
    country: responseData.sys.country,
  };
}

async function getUser(username) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

async function getStockInfo(symbol) {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v1/meta/symbols/${symbol}/company?apiKey=${POLYGONIO_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock info:", error);
    throw error;
  }
}
