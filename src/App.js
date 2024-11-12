import React, { useState } from 'react';
import MapComponent from './MapComponent';
import axios from 'axios';

const API_KEY = '6e6908ab91b24662b27144821242110';
const BASE_URL = 'https://api.weatherapi.com/v1';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (location) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/current.json?key=${API_KEY}&q=${location}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <MapComponent onLocationSelect={fetchWeatherData} />
      <div className="p-4 bg-gray-800 text-white">
        {loading ? (
          <p>Loading...</p>
        ) : (
          weatherData && (
            <div>
              <h2 className="text-xl">{weatherData.location.name}</h2>
              <p>Temperature: {weatherData.current.temp_c} °C</p>
              <p>Condition: {weatherData.current.condition.text}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;

