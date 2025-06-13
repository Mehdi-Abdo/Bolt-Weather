import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Thermometer, Droplets, Wind, Compass, Sun, CloudRain } from 'lucide-react';

const CurrentWeather: React.FC = () => {
  const { weatherData, tempUnit } = useWeather();

  if (!weatherData) return null;

  const { current, location } = weatherData;
  const temperature = tempUnit === 'celsius' ? current.temp_c : current.temp_f;
  const feelsLike = tempUnit === 'celsius' ? current.feelslike_c : current.feelslike_f;
  const windSpeed = tempUnit === 'celsius' ? current.wind_kph : current.wind_mph;
  const windUnit = tempUnit === 'celsius' ? 'km/h' : 'mph';

  // Format time
  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get background gradient based on temperature and time
  const getBackgroundGradient = () => {
    const time = new Date(location.localtime);
    const hour = time.getHours();
    const isDay = hour >= 6 && hour < 18;
    
    // Night time
    if (!isDay) {
      return 'bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900';
    }
    
    // Rainy conditions
    if (current.condition.text.toLowerCase().includes('rain')) {
      return 'bg-gradient-to-b from-gray-700 via-blue-800 to-gray-800';
    }
    
    // Cloudy conditions
    if (current.condition.text.toLowerCase().includes('cloud')) {
      return 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600';
    }
    
    // Sunny day - adjust based on temperature
    if (current.temp_c > 30) {
      return 'bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500'; // Hot
    } else if (current.temp_c > 20) {
      return 'bg-gradient-to-b from-blue-400 via-sky-500 to-blue-600'; // Warm
    } else {
      return 'bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500'; // Mild/cool
    }
  };

  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl mb-6 ${getBackgroundGradient()}`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {location.name}
            </h1>
            <p className="text-white text-opacity-90 mb-4">
              {location.region}, {location.country}
            </p>
          </div>
          
          <div className="text-white text-opacity-90">
            {formatTime(location.localtime)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center">
              <span className="text-6xl md:text-7xl font-bold text-white">
                {Math.round(temperature)}°
              </span>
              <span className="text-xl text-white ml-1 mt-4">
                {tempUnit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
            
            <p className="text-xl text-white mt-2">
              {current.condition.text}
            </p>
            
            <p className="text-white text-opacity-90 mt-1">
              Feels like {Math.round(feelsLike)}°{tempUnit === 'celsius' ? 'C' : 'F'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center text-white mb-1">
                <Thermometer className="w-5 h-5 mr-2" />
                <span>Humidity</span>
              </div>
              <p className="text-xl font-semibold text-white">{current.humidity}%</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center text-white mb-1">
                <Wind className="w-5 h-5 mr-2" />
                <span>Wind</span>
              </div>
              <p className="text-xl font-semibold text-white">{Math.round(windSpeed)} {windUnit}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center text-white mb-1">
                <Compass className="w-5 h-5 mr-2" />
                <span>Direction</span>
              </div>
              <p className="text-xl font-semibold text-white">{current.wind_dir}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center text-white mb-1">
                <Droplets className="w-5 h-5 mr-2" />
                <span>Precipitation</span>
              </div>
              <p className="text-xl font-semibold text-white">
                {tempUnit === 'celsius' ? `${current.precip_mm} mm` : `${current.precip_in} in`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;