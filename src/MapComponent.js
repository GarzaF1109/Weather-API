import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Input from './Input';

const API_KEY = '6e6908ab91b24662b27144821242110';
const BASE_URL = 'https://api.weatherapi.com/v1';

const customIcon = L.icon({
  iconUrl: '/map-marker-512.webp',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45],
});

const UpdateMapCenter = ({ position }) => {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
};

const MapComponent = () => {
  const [city, setCity] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [position, setPosition] = useState([20, 0]);

  const fetchWeatherData = async (cityName) => {
    try {
      const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${cityName}`;
      const response = await axios.get(url);
      const data = response.data;
      setLocationData({
        name: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.text,
      });
      setPosition([data.location.lat, data.location.lon]);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('No se encontró la ciudad. Intente con otra.');
    }
  };

  const handleSearch = (cityName) => {
    if (cityName.trim()) {
      fetchWeatherData(cityName);
      setCity('');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <Input handleSearch={handleSearch} />
      </div>

      <MapContainer center={position} zoom={3} scrollWheelZoom={false} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locationData && (
          <>
            <Marker position={position} icon={customIcon}>
              <Popup>
                <div>
                  <h3>{locationData.name}, {locationData.country}</h3>
                  <p>Temperatura: {locationData.temp}°C</p>
                  <p>Condición: {locationData.condition}</p>
                </div>
              </Popup>
            </Marker>
            <UpdateMapCenter position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;




