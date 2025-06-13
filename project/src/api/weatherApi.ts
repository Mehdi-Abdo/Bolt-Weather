import axios from 'axios';
import { WeatherData } from '../types/weather';

const API_KEY = '891386664a64a4ab04e363e0aa0c4b1d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch weather data for a specific location
 * @param query Location query (city name, ZIP code, coordinates)
 * @param days Number of forecast days (1-10)
 * @returns Promise with weather data
 */
export const fetchWeatherData = async (query: string, days: number = 7): Promise<WeatherData> => {
  try {
    // First, get current weather and coordinates
    const currentResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: query,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Use coordinates for more accurate forecast
    const { lat, lon } = currentResponse.data.coord;

    // Get detailed forecast including current, hourly, and daily data
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: days * 8, // 8 forecasts per day
      },
    });

    // Transform the data to match our WeatherData interface
    return transformWeatherData(currentResponse.data, forecastResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      }
      throw new Error(error.response?.data.message || 'Failed to fetch weather data');
    }
    throw new Error('Network error. Please check your internet connection.');
  }
};

/**
 * Get user's current location using browser geolocation API
 * @returns Promise with latitude and longitude
 */
export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location access denied. Please enable location services or search for a city manually.';
        }
        reject(new Error(errorMessage));
      }
    );
  });
};

/**
 * Get weather data for the user's current location
 * @param days Number of forecast days
 * @returns Promise with weather data
 */
export const fetchCurrentLocationWeather = async (days: number = 7): Promise<WeatherData> => {
  try {
    const { lat, lon } = await getCurrentLocation();
    
    // Get current weather data
    const currentResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    // Get forecast data
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: days * 8, // 8 forecasts per day
      },
    });

    return transformWeatherData(currentResponse.data, forecastResponse.data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get current location weather data');
  }
};

/**
 * Transform OpenWeatherMap data to match our WeatherData interface
 */
function transformWeatherData(currentData: any, forecastData: any): WeatherData {
  const location = {
    name: currentData.name,
    region: '',
    country: currentData.sys.country,
    lat: currentData.coord.lat,
    lon: currentData.coord.lon,
    localtime: new Date(currentData.dt * 1000).toISOString(),
  };

  const current = {
    temp_c: currentData.main.temp,
    temp_f: (currentData.main.temp * 9/5) + 32,
    condition: {
      text: currentData.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
      code: currentData.weather[0].id,
    },
    wind_mph: currentData.wind.speed * 2.237,
    wind_kph: currentData.wind.speed * 3.6,
    wind_dir: getWindDirection(currentData.wind.deg),
    pressure_mb: currentData.main.pressure,
    pressure_in: currentData.main.pressure * 0.02953,
    precip_mm: currentData.rain?.['1h'] || 0,
    precip_in: (currentData.rain?.['1h'] || 0) * 0.0393701,
    humidity: currentData.main.humidity,
    cloud: currentData.clouds.all,
    feelslike_c: currentData.main.feels_like,
    feelslike_f: (currentData.main.feels_like * 9/5) + 32,
    uv: 0, // OpenWeatherMap free API doesn't provide UV index
  };

  // Group forecast data by day
  const dailyForecasts = groupForecastsByDay(forecastData.list);

  const forecast = {
    forecastday: dailyForecasts.map((day: any) => ({
      date: day.dt_txt.split(' ')[0],
      date_epoch: day.dt,
      day: {
        maxtemp_c: day.main.temp_max,
        maxtemp_f: (day.main.temp_max * 9/5) + 32,
        mintemp_c: day.main.temp_min,
        mintemp_f: (day.main.temp_min * 9/5) + 32,
        avgtemp_c: day.main.temp,
        avgtemp_f: (day.main.temp * 9/5) + 32,
        maxwind_mph: day.wind.speed * 2.237,
        maxwind_kph: day.wind.speed * 3.6,
        totalprecip_mm: day.rain?.['3h'] || 0,
        totalprecip_in: (day.rain?.['3h'] || 0) * 0.0393701,
        totalsnow_cm: day.snow?.['3h'] || 0,
        avgvis_km: day.visibility / 1000,
        avgvis_miles: day.visibility / 1609.34,
        avghumidity: day.main.humidity,
        daily_will_it_rain: day.rain ? 1 : 0,
        daily_chance_of_rain: day.pop * 100,
        daily_will_it_snow: day.snow ? 1 : 0,
        daily_chance_of_snow: day.snow ? day.pop * 100 : 0,
        condition: {
          text: day.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          code: day.weather[0].id,
        },
        uv: 0,
      },
      astro: {
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString(),
        moonrise: '',
        moonset: '',
        moon_phase: '0',
        moon_illumination: '0',
      },
      hour: generateHourlyForecast(forecastData.list.slice(0, 24)),
    })),
  };

  return { location, current, forecast };
}

/**
 * Group forecast data by day
 */
function groupForecastsByDay(forecasts: any[]): any[] {
  const dailyForecasts: any[] = [];
  const days = new Set(forecasts.map(f => f.dt_txt.split(' ')[0]));
  
  days.forEach(day => {
    const dayForecasts = forecasts.filter(f => f.dt_txt.startsWith(day));
    if (dayForecasts.length > 0) {
      // Use the middle of the day forecast (noon) as representative
      const noonForecast = dayForecasts.find(f => f.dt_txt.includes('12:00:00')) || dayForecasts[0];
      dailyForecasts.push(noonForecast);
    }
  });

  return dailyForecasts.slice(0, 7); // Limit to 7 days
}

/**
 * Generate hourly forecast data
 */
function generateHourlyForecast(hourlyData: any[]): any[] {
  return hourlyData.map(hour => ({
    time_epoch: hour.dt,
    time: hour.dt_txt,
    temp_c: hour.main.temp,
    temp_f: (hour.main.temp * 9/5) + 32,
    condition: {
      text: hour.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
      code: hour.weather[0].id,
    },
    wind_mph: hour.wind.speed * 2.237,
    wind_kph: hour.wind.speed * 3.6,
    wind_dir: getWindDirection(hour.wind.deg),
    pressure_mb: hour.main.pressure,
    pressure_in: hour.main.pressure * 0.02953,
    precip_mm: hour.rain?.['3h'] || 0,
    precip_in: (hour.rain?.['3h'] || 0) * 0.0393701,
    humidity: hour.main.humidity,
    cloud: hour.clouds.all,
    feelslike_c: hour.main.feels_like,
    feelslike_f: (hour.main.feels_like * 9/5) + 32,
    windchill_c: hour.main.feels_like,
    windchill_f: (hour.main.feels_like * 9/5) + 32,
    heatindex_c: hour.main.feels_like,
    heatindex_f: (hour.main.feels_like * 9/5) + 32,
    dewpoint_c: hour.main.temp - ((100 - hour.main.humidity) / 5),
    dewpoint_f: ((hour.main.temp - ((100 - hour.main.humidity) / 5)) * 9/5) + 32,
    will_it_rain: hour.rain ? 1 : 0,
    chance_of_rain: hour.pop * 100,
    will_it_snow: hour.snow ? 1 : 0,
    chance_of_snow: hour.snow ? hour.pop * 100 : 0,
    vis_km: hour.visibility / 1000,
    vis_miles: hour.visibility / 1609.34,
    gust_mph: (hour.wind.gust || hour.wind.speed) * 2.237,
    gust_kph: (hour.wind.gust || hour.wind.speed) * 3.6,
  }));
}

/**
 * Convert wind degrees to cardinal direction
 */
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
}