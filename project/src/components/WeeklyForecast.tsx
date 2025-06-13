import React from 'react';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from './WeatherCard';

const WeeklyForecast: React.FC = () => {
  const { weatherData, tempUnit } = useWeather();
  
  if (!weatherData) return null;
  
  const { forecast } = weatherData;
  
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg border border-white border-opacity-20">
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-4">7-Day Forecast</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.forecastday.map((day, index) => (
            <WeatherCard
              key={day.date}
              date={day.date}
              temp={{
                min: tempUnit === 'celsius' ? day.day.mintemp_c : day.day.mintemp_f,
                max: tempUnit === 'celsius' ? day.day.maxtemp_c : day.day.maxtemp_f
              }}
              condition={day.day.condition}
              isToday={index === 0}
              isTomorrow={index === 1}
              tempUnit={tempUnit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyForecast;