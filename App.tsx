
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchLocationName } from './services/weatherService';
import type { WeatherData } from './types';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

type Status = 'idle' | 'loading' | 'success' | 'error';

// Helper function to determine background based on weather
const getBackgroundClass = (weatherCode: number, isDay: number): string => {
  const isDayTime = isDay === 1;

  switch (weatherCode) {
    case 0: // Clear sky
      return isDayTime
        ? 'from-sky-400 to-blue-600'
        : 'from-slate-900 via-indigo-900 to-slate-900';
    case 1: // Mainly clear
    case 2: // Partly cloudy
    case 3: // Overcast
      return isDayTime
        ? 'from-sky-600 to-slate-500'
        : 'from-slate-700 to-slate-900';
    case 45: // Fog
    case 48: // Depositing rime fog
      return 'from-slate-400 to-slate-600';
    case 51: // Drizzle
    case 53:
    case 55:
    case 61: // Rain
    case 63:
    case 65:
    case 80: // Rain showers
    case 81:
    case 82:
      return 'from-slate-600 via-blue-900 to-slate-800';
    case 71: // Snow fall
    case 73:
    case 75:
    case 85: // Snow showers
    case 86:
      return 'from-sky-200 to-slate-400';
    case 95: // Thunderstorm
    case 96:
    case 99:
      return 'from-slate-800 via-purple-900 to-slate-900';
    default:
      return 'from-blue-900 to-indigo-900'; // Default fallback
  }
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getWeatherData = useCallback(() => {
    setStatus('loading');
    setError(null);

    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [weather, name] = await Promise.all([
            fetchWeatherData(latitude, longitude),
            fetchLocationName(latitude, longitude)
          ]);
          setWeatherData(weather);
          setLocationName(name);
          setStatus('success');
        } catch (err) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
      },
      (geoError) => {
        setStatus('error');
        let message = 'An error occurred while retrieving your location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          message = 'Location access was denied. Please enable it in your browser settings to use this app.';
        }
        setError(message);
      }
    );
  }, []);

  useEffect(() => {
    getWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundClass = status === 'success' && weatherData
    ? getBackgroundClass(weatherData.current.weather_code, weatherData.current.is_day)
    : 'from-blue-900 to-indigo-900';

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <LoadingSpinner />;
      case 'success':
        return weatherData && locationName ? (
          <>
            <CurrentWeather data={weatherData.current} locationName={locationName} />
            <Forecast data={weatherData.daily} />
          </>
        ) : null;
      case 'error':
        return <ErrorDisplay message={error || 'An unexpected error occurred.'} onRetry={getWeatherData} />;
      case 'idle':
      default:
        return (
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Welcome to Weather Forecast</h1>
            <p className="text-lg mb-6">Please allow location access to see the weather in your area.</p>
            <button
              onClick={getWeatherData}
              className="px-6 py-3 bg-white text-blue-900 font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              Get My Weather
            </button>
          </div>
        );
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => setIsModalOpen(false)} // Close on backdrop click
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-slate-800 relative transform transition-all animate-fade-in-up"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
            aria-label="Close project details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">JalVayu Live</h2>
          <div className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-bold text-lg text-slate-800">About the Project</h3>
              <p className="mt-1">
                This web application provides real-time local weather and rainfall forecasts using live data from weather APIs. It automatically detects the user's location to deliver accurate and current weather information.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Group: homiee 6</h3>
              <ul className="list-disc list-inside mt-1 grid grid-cols-2 gap-x-4">
                <li>Anmol</li>
                <li>Piyush</li>
                <li>Ankit</li>
                <li>Amit</li>
                <li>Ashok</li>
                <li>Ashish</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center font-sans transition-colors duration-1000 ${backgroundClass}`}>
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
       <footer className="text-white/50 text-xs text-center mt-8 w-full max-w-4xl">
        <p>Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Open-Meteo</a>.</p>
        <p>Location data provided by <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">OpenStreetMap</a>.</p>
        <p>By Homiee&lt;&lt;&lt;6</p>
         <div className="mt-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-full transition-colors"
          >
            Project Details
          </button>
        </div>
      </footer>
      {renderModal()}
    </main>
  );
};

export default App;
