import React from "react";
import "./Weather.css";
import { useState, useEffect } from "react";

const API_KEY = "e5d99445e8cf2e31b198547b33536fa0";
const CITY = "Kanpur";
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`;

function Weather() {
  const [temp, setTemp] = useState(0);
  const [imgUrl, setImgUrl] = useState("https://openweathermap.org/img/wn/01d@2x.png");
  const [tempDesc, setTempDesc] = useState("");

  useEffect(() => {
    let imageUrl = "";
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTemp(data.main.feels_like);
        imageUrl =
          "https://openweathermap.org/img/wn/" +
          data.weather[0].icon +
          "@2x.png";
        setImgUrl(imageUrl);
        setTempDesc(data.weather[0].description);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching weather:", error.message);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="weather flex align-items-center ">
      <img className="weather_icon" src={imgUrl} alt={tempDesc} />
      <div className="temp">{(temp - 273.15).toFixed(2)}°C</div>
    </div>
  );
}

export default Weather;

// RESPONSE
// {
//   coord: { lon: 80.35, lat: 26.4667 },
//   weather: [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' } ],
//   base: 'stations',
//   main: {
//     temp: 313.98,
//     feels_like: 311.64,
//     temp_min: 313.98,
//     temp_max: 313.98,
//     pressure: 1004,
//     humidity: 13,
//     sea_level: 1004,
//     grnd_level: 989
//   },
//   visibility: 10000,
//   wind: { speed: 7.66, deg: 278, gust: 11.65 },
//   clouds: { all: 5 },
//   dt: 1713262051,
//   sys: { country: 'IN', sunrise: 1713226428, sunset: 1713272549 },
//   timezone: 19800,
//   id: 1267995,
//   name: 'Kanpur',
//   cod: 200
// }
