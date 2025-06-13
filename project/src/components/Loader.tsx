import React from 'react';
import { Cloud, CloudRain } from 'lucide-react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <div className="relative">
        <Cloud className="w-16 h-16 animate-pulse text-blue-300" />
        <CloudRain className="w-10 h-10 absolute -bottom-4 -right-4 text-blue-400 animate-bounce" />
      </div>
      <p className="mt-6 text-xl font-medium">Loading weather data...</p>
      <p className="mt-2 text-white text-opacity-70">Please wait a moment</p>
    </div>
  );
};

export default Loader;