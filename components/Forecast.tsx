import React from 'react';
import type { DailyForecast as DailyForecastType } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface ForecastProps {
  data: DailyForecastType;
}

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg text-white w-full mt-6">
      <h3 className="text-xl font-bold mb-4 border-b border-white/30 pb-2">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {data.time.slice(0, 7).map((day, index) => (
          <div key={day} className="flex flex-col items-center bg-white/10 p-3 rounded-2xl">
            <p className="font-semibold text-lg">
              {new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <WeatherIcon code={data.weather_code[index]} className="w-12 h-12 my-2" />
            <div className="flex items-baseline space-x-1">
              <p className="font-bold text-xl">{Math.round(data.temperature_2m_max[index])}°</p>
              <p className="text-sm opacity-70">{Math.round(data.temperature_2m_min[index])}°</p>
            </div>
             <div className="flex items-center space-x-1 mt-1 opacity-80 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path>
                </svg>
                <span>{data.precipitation_probability_max[index]}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;