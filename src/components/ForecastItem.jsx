import React from 'react';

const ForecastItem = ({ date, icon, temp }) => {
  return (
    <div className="forecast-item">
      <h5 className="forecast-item-date regular-txt">{date}</h5>
      <img src={icon} alt="forecast-icon" className="forecast-item-img" />
      <h5 className="forecast-item-temp">{temp} °C</h5>
    </div>
  );
};

export default ForecastItem;
