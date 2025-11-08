import { WeatherData } from '../types';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_BASE = 'https://nominatim.openstreetmap.org/reverse';

export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,apparent_temperature,precipitation,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'auto',
  });

  const response = await fetch(`${WEATHER_API_BASE}?${params}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.reason || 'Failed to fetch weather data');
  }

  return response.json();
};

export const fetchLocationName = async (latitude: number, longitude: number): Promise<string> => {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    format: 'json',
    zoom: '10',
  });

  const response = await fetch(`${GEOCODING_API_BASE}?${params}`, {
    headers: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch location name');
  }

  const data = await response.json();
  if (data.error) {
    return "Unknown Location";
  }
  
  const { city, town, village, county, state, country } = data.address;
  return city || town || village || county || state || country || 'Your Location';
};