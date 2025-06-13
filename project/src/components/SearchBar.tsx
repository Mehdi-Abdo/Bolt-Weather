import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const SearchBar: React.FC = () => {
  const { searchLocation, useCurrentLocation, loading } = useWeather();
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      searchLocation(inputValue.trim());
      // On mobile, collapse the search after submission
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    }
  };

  const handleCurrentLocation = () => {
    useCurrentLocation();
    setInputValue('');
    // On mobile, collapse the search after using current location
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0">
      <div
        className={`flex items-center rounded-full bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-full' : 'w-10 md:w-full'
        }`}
      >
        <button
          type="button"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Search className="w-5 h-5" />
        </button>

        <form
          onSubmit={handleSubmit}
          className={`flex-grow flex items-center transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100 w-0 md:w-auto'
          }`}
        >
          <input
            type="text"
            placeholder="Search for a city..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white placeholder-opacity-70 px-2 py-2 focus:outline-none"
            disabled={loading}
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClearInput}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCurrentLocation}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white"
            disabled={loading}
            title="Use current location"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;