import React from 'react';
import { Cloud, Thermometer } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const { toggleTempUnit, tempUnit } = useWeather();

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-gradient-to-r from-blue-900/70 to-blue-700/70 border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Cloud className="h-8 w-8 text-blue-300" />
            <h1 className="ml-2 text-2xl font-bold text-white">WeatherWorld</h1>
          </div>

          <div className="flex-grow max-w-md w-full">
            <SearchBar />
          </div>

          <button
            onClick={toggleTempUnit}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors text-white"
          >
            <Thermometer className="h-4 w-4" />
            <span>{tempUnit === 'celsius' ? '°C' : '°F'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;