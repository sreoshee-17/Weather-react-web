import React, { useState } from 'react';
import ForecastItem from './ForecastItem';
import '../style.css';

import SearchIcon from '../assets/message/search-city.png';
import NotFoundIcon from '../assets/message/not-found.png';

import ThunderstormIcon from '../assets/weather/thunderstorm.svg';
import DrizzleIcon from '../assets/weather/drizzle.svg';
import RainIcon from '../assets/weather/rain.svg';
import SnowIcon from '../assets/weather/snow.svg';
import AtmosphereIcon from '../assets/weather/atmosphere.svg';
import ClearIcon from '../assets/weather/clear.svg';
import CloudsIcon from '../assets/weather/clouds.svg';

const apiKey = 'ee081bebe604e55f70707dcee2b8887b';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(false);

  const getWeatherIcon = (id) => {
    if (id <= 232) return ThunderstormIcon;
    if (id <= 321) return DrizzleIcon;
    if (id <= 531) return RainIcon;
    if (id <= 622) return SnowIcon;
    if (id <= 781) return AtmosphereIcon;
    if (id === 800) return ClearIcon;
    return CloudsIcon;
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return currentDate.toLocaleDateString('en-GB', options);
  };

  const fetchWeather = async () => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const weatherJson = await weatherResponse.json();
      
      if (weatherJson.cod !== 200) throw new Error();

      const { main, weather, wind, name } = weatherJson;
      setWeatherData({
        country: name,
        temp: Math.round(main.temp),
        condition: weather[0].main,
        humidity: main.humidity,
        windSpeed: wind.speed,
        icon: getWeatherIcon(weather[0].id),
        date: getCurrentDate(),
      });
      await fetchForecast();
      setError(false);
    } catch (err) {
      setError(true);
      setWeatherData(null);
      setForecastData([]);
    }
  };

  const fetchForecast = async () => {
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastJson = await forecastResponse.json();

    const dailyForecasts = forecastJson.list.filter((item) =>
      item.dt_txt.includes('12:00:00')
    );
    const formattedForecasts = dailyForecasts.map((forecast) => ({
      date: new Date(forecast.dt_txt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      icon: getWeatherIcon(forecast.weather[0].id),
      temp: Math.round(forecast.main.temp),
    }));
    setForecastData(formattedForecasts);
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather();
      setCity('');
    }
  };

  return (
    <main className="main-container">
      <header className="input-container">
        <input
          type="text"
          className="city-input"
          value={city}
          placeholder="Search City"
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      {error ? (
        <section className="not-found section-message">
          <img src={NotFoundIcon} alt="Not Found" />
          <h1>City Not Found</h1>
          <h4 className="regular-txt">Please try searching again</h4>
        </section>
      ) : weatherData ? (
        <section className="weather-info">
          <div className="location-date-container">
            <div className="location">
              <span className="material-symbols-outlined">location_on</span>
              <h4 className="country-txt">{weatherData.country}</h4>
            </div>
            <h5 className="current-date-txt regular-txt">{weatherData.date}</h5>
          </div>

          <div className="weather-summary-container">
            <img src={weatherData.icon} className="weather-summary-img" alt="Weather Icon" />
            <div className="weather-summary-info">
              <h1 className="temp-txt">{weatherData.temp} °C</h1>
              <h3 className="condition-txt regular-txt">{weatherData.condition}</h3>
            </div>
          </div>

          <div className="weather-conditions-container">
            <div className="condition-item">
              <span className="material-symbols-outlined">water_drop</span>
              <div className="condition-info">
                <h5 className="regular-txt">Humidity</h5>
                <h5 className="humidity-value-txt">{weatherData.humidity}%</h5>
              </div>
            </div>

            <div className="condition-item">
              <span className="material-symbols-outlined">air</span>
              <div className="condition-info">
                <h5 className="regular-txt">Wind Speed</h5>
                <h5 className="wind-value-txt">{weatherData.windSpeed} M/s</h5>
              </div>
            </div>
          </div>

          <div className="forecast-items-container">
            {forecastData.map((forecast, index) => (
              <ForecastItem key={index} date={forecast.date} icon={forecast.icon} temp={forecast.temp} />
            ))}
          </div>
        </section>
      ) : (
        <section className="search-city section-message">
          <img src={SearchIcon} alt="Search City" />
          <h1>Search City</h1>
          <h4 className="regular-txt">Find out the weather conditions of the city</h4>
        </section>
      )}
    </main>
  );
};

export default WeatherApp;
