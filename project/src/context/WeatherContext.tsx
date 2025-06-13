import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherData, fetchCurrentLocationWeather } from '../api/weatherApi';

interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  searchLocation: (query: string) => Promise<void>;
  useCurrentLocation: () => Promise<void>;
  tempUnit: 'celsius' | 'fahrenheit';
  toggleTempUnit: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  // Fetch weather data for a given location
  const searchLocation = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(query);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Use the user's current location
  const useCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCurrentLocationWeather();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Fall back to a default location if current location fails
      await searchLocation('London');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between Celsius and Fahrenheit
  const toggleTempUnit = () => {
    setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  // Initialize with user's location or default to London
  useEffect(() => {
    useCurrentLocation().catch(() => {
      searchLocation('London');
    });
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        searchLocation,
        useCurrentLocation,
        tempUnit,
        toggleTempUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};