import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { ChevronRight, ChevronLeft, CloudRain, Cloud, CloudSun, Sun, CloudSnow, CloudFog, CloudLightning } from 'lucide-react';

const TomorrowForecast: React.FC = () => {
  const { weatherData, tempUnit } = useWeather();
  const [startIndex, setStartIndex] = useState(0);

  if (!weatherData || !weatherData.forecast.forecastday[1]) return null;

  const tomorrow = weatherData.forecast.forecastday[1];
  // Get hours from 6am to 9pm (total of 16 hours)
  const hourlyData = tomorrow.hour.filter((hour) => {
    const hourNum = parseInt(hour.time.split(' ')[1].split(':')[0]);
    return hourNum >= 6 && hourNum <= 21;
  });

  const displayHours = hourlyData.slice(startIndex, startIndex + 6);
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + 6 < hourlyData.length;

  const handleScrollLeft = () => {
    if (canScrollLeft) {
      setStartIndex(Math.max(0, startIndex - 3));
    }
  };

  const handleScrollRight = () => {
    if (canScrollRight) {
      setStartIndex(Math.min(hourlyData.length - 6, startIndex + 3));
    }
  };

  // Format hour
  const formatHour = (timeStr: string) => {
    const hour = parseInt(timeStr.split(' ')[1].split(':')[0]);
    return hour === 12 ? '12 PM' : hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  // Helper to get weather icon based on condition code
  const getWeatherIcon = (code: number) => {
    // Sunny / Clear
    if (code === 1000) return <Sun className="w-8 h-8 text-yellow-400" />;
    
    // Partly cloudy
    if (code === 1003) return <CloudSun className="w-8 h-8 text-blue-300" />;
    
    // Cloudy
    if ([1006, 1009].includes(code)) return <Cloud className="w-8 h-8 text-gray-400" />;
    
    // Rain / Drizzle
    if ([1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code))
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    
    // Snow
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code))
      return <CloudSnow className="w-8 h-8 text-blue-100" />;
    
    // Fog / Mist
    if ([1030, 1135, 1147].includes(code)) return <CloudFog className="w-8 h-8 text-gray-300" />;
    
    // Thunderstorm
    if ([1087, 1273, 1276, 1279, 1282].includes(code))
      return <CloudLightning className="w-8 h-8 text-yellow-500" />;
    
    // Default
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg mb-6 border border-white border-opacity-20">
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-4">Tomorrow's Forecast</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white text-opacity-80">{new Date(tomorrow.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleScrollLeft}
              disabled={!canScrollLeft}
              className={`p-1 rounded-full mr-1 ${canScrollLeft ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-gray-500'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleScrollRight}
              disabled={!canScrollRight}
              className={`p-1 rounded-full ${canScrollRight ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-gray-500'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {displayHours.map((hour) => (
            <div key={hour.time_epoch} className="bg-white bg-opacity-5 rounded-xl p-3 flex flex-col items-center">
              <span className="text-sm font-medium text-white">{formatHour(hour.time)}</span>
              <div className="my-2">
                {getWeatherIcon(hour.condition.code)}
              </div>
              <span className="text-lg font-semibold text-white">
                {tempUnit === 'celsius' ? `${Math.round(hour.temp_c)}°C` : `${Math.round(hour.temp_f)}°F`}
              </span>
              <span className="text-xs text-white text-opacity-70 mt-1">
                {hour.chance_of_rain > 0 ? `${hour.chance_of_rain}% rain` : '\u00A0'}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white bg-opacity-5 rounded-xl p-3">
            <p className="text-sm text-white text-opacity-70">Max Temp</p>
            <p className="text-lg font-semibold text-white">
              {tempUnit === 'celsius' ? `${Math.round(tomorrow.day.maxtemp_c)}°C` : `${Math.round(tomorrow.day.maxtemp_f)}°F`}
            </p>
          </div>
          
          <div className="bg-white bg-opacity-5 rounded-xl p-3">
            <p className="text-sm text-white text-opacity-70">Min Temp</p>
            <p className="text-lg font-semibold text-white">
              {tempUnit === 'celsius' ? `${Math.round(tomorrow.day.mintemp_c)}°C` : `${Math.round(tomorrow.day.mintemp_f)}°F`}
            </p>
          </div>
          
          <div className="bg-white bg-opacity-5 rounded-xl p-3">
            <p className="text-sm text-white text-opacity-70">Chance of Rain</p>
            <p className="text-lg font-semibold text-white">{tomorrow.day.daily_chance_of_rain}%</p>
          </div>
          
          <div className="bg-white bg-opacity-5 rounded-xl p-3">
            <p className="text-sm text-white text-opacity-70">Humidity</p>
            <p className="text-lg font-semibold text-white">{tomorrow.day.avghumidity}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomorrowForecast;