import React from 'react';
import type { CurrentWeather as CurrentWeatherType } from '../types';
import { WeatherIcon, getWeatherDescription } from './WeatherIcon';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  locationName: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, locationName }) => {
  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg text-white w-full">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left Side: Location & Temp */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold">{locationName}</h2>
          <p className="text-7xl md:text-8xl font-thin tracking-tighter">{Math.round(data.temperature_2m)}°</p>
          <p className="text-lg">Feels like {Math.round(data.apparent_temperature)}°</p>
        </div>
        
        {/* Right Side: Icon & Description */}
        <div className="flex flex-col items-center">
          <WeatherIcon code={data.weather_code} isDay={data.is_day === 1} className="w-32 h-32 text-white" />
          <p className="text-xl font-medium mt-2">{getWeatherDescription(data.weather_code)}</p>
          <p className="text-md">Rainfall: {data.precipitation} mm</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;