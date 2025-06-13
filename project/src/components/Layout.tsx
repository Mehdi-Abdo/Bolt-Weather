import React, { ReactNode } from 'react';
import Header from './Header';
import { useWeather } from '../context/WeatherContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { weatherData } = useWeather();
  
  // Get background gradient based on weather conditions
  const getBackgroundGradient = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-800 via-blue-900 to-gray-900';
    
    const { current } = weatherData;
    const condition = current.condition.text.toLowerCase();
    const isNight = current.cloud > 70;
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'bg-gradient-to-br from-gray-700 via-blue-800 to-gray-900';
    } else if (condition.includes('snow')) {
      return 'bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500';
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
      return 'bg-gradient-to-br from-gray-400 via-gray-600 to-blue-800';
    } else if (isNight) {
      return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-800';
    } else {
      // Sunny or clear
      if (current.temp_c > 30) {
        return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500';
      } else if (current.temp_c > 20) {
        return 'bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600';
      } else {
        return 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700';
      }
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundGradient()} transition-colors duration-1000`}>
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-white text-opacity-60 text-sm">
        <p>© 2025 WeatherWorld. Weather data provided by WeatherAPI.com</p>
      </footer>
    </div>
  );
};

export default Layout;