import React from 'react';
import { 
  Cloud, CloudRain, CloudSnow, CloudFog, 
  CloudLightning, Sun, CloudSun, Wind
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherCardProps {
  date: string;
  temp: { min: number; max: number };
  condition: WeatherCondition;
  isToday?: boolean;
  isTomorrow?: boolean;
  tempUnit: 'celsius' | 'fahrenheit';
  onClick?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  date,
  temp,
  condition,
  isToday = false,
  isTomorrow = false,
  tempUnit,
  onClick,
}) => {
  // Helper to get day name
  const getDayName = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    const date = new Date(dateStr);
    return isToday 
      ? 'Today' 
      : isTomorrow 
        ? 'Tomorrow' 
        : new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Helper to get icon based on condition code
  const getWeatherIcon = (condition: WeatherCondition) => {
    const code = condition.code;
    
    // Sunny / Clear
    if (code === 1000) return <Sun className="w-10 h-10 text-yellow-400" />;
    
    // Partly cloudy
    if (code === 1003) return <CloudSun className="w-10 h-10 text-blue-300" />;
    
    // Cloudy
    if ([1006, 1009].includes(code)) return <Cloud className="w-10 h-10 text-gray-400" />;
    
    // Rain / Drizzle
    if ([1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code))
      return <CloudRain className="w-10 h-10 text-blue-400" />;
    
    // Snow
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code))
      return <CloudSnow className="w-10 h-10 text-blue-100" />;
    
    // Fog / Mist
    if ([1030, 1135, 1147].includes(code)) return <CloudFog className="w-10 h-10 text-gray-300" />;
    
    // Thunderstorm
    if ([1087, 1273, 1276, 1279, 1282].includes(code))
      return <CloudLightning className="w-10 h-10 text-yellow-500" />;
    
    // Default
    return <Wind className="w-10 h-10 text-gray-400" />;
  };

  return (
    <div 
      className={`
        bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4
        border border-white border-opacity-20 flex flex-col items-center
        hover:bg-opacity-20 transition-all duration-300 cursor-pointer
        ${isToday ? 'ring-2 ring-blue-400' : ''}
      `}
      onClick={onClick}
    >
      <h3 className="font-medium text-white mb-2">{getDayName(date)}</h3>
      
      <div className="my-2">
        {getWeatherIcon(condition)}
      </div>
      
      <p className="text-sm text-white text-opacity-80 mb-3">{condition.text}</p>
      
      <div className="flex items-center justify-between w-full">
        <span className="text-white font-medium">
          {tempUnit === 'celsius' ? `${Math.round(temp.min)}°C` : `${Math.round(temp.min)}°F`}
        </span>
        <span className="text-white font-bold">
          {tempUnit === 'celsius' ? `${Math.round(temp.max)}°C` : `${Math.round(temp.max)}°F`}
        </span>
      </div>
    </div>
  );
};

export default WeatherCard;