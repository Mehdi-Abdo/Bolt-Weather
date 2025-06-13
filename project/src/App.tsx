import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import Layout from './components/Layout';
import CurrentWeather from './components/CurrentWeather';
import TomorrowForecast from './components/TomorrowForecast';
import WeeklyForecast from './components/WeeklyForecast';
import Loader from './components/Loader';
import { useWeather } from './context/WeatherContext';

// Content component to handle loading states
const WeatherContent: React.FC = () => {
  const { loading, error, weatherData } = useWeather();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <p className="text-xl font-medium">Oops! Something went wrong.</p>
        <p className="mt-2 text-white text-opacity-70">{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <p className="text-xl font-medium">No weather data available.</p>
        <p className="mt-2 text-white text-opacity-70">Please search for a location.</p>
      </div>
    );
  }

  return (
    <>
      <CurrentWeather />
      <TomorrowForecast />
      <WeeklyForecast />
    </>
  );
};

function App() {
  return (
    <WeatherProvider>
      <Layout>
        <WeatherContent />
      </Layout>
    </WeatherProvider>
  );
}

export default App;