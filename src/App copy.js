import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { FaSun, FaMoon } from 'react-icons/fa';

// Define the default icon
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getCoordinatesForCity = async (cityName) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`);
    if (response.data.length) {
      const { lat, lon } = response.data[0];
      return [parseFloat(lat), parseFloat(lon)];
    } else {
      console.error('City not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates', error);
    return null;
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 50px 0;
`;

const Input = styled.input`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 20px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007aff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005fcc;
  }
`;

function PanToNewCity({ coordinates }) {
  const map = useMap();
  map.flyTo(coordinates, 10);
  return null;
}

function Header({ darkMode, toggleDarkMode }) {
  return (
    <div className="header">
      <h1>Snowday</h1>
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>
    </div>
  );
}

function CityTimeline({ history }) {
  return (
    <div className="city-timeline">
      <h4>City Addition History</h4>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            {item.timestamp.toLocaleString()} : {item.cityName}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cityHistory, setCityHistory] = useState([]);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [position] = useState([51.505, -0.09]); // Default to London
  const positions = cities.map(cityData => cityData.coordinates);
  const [isNewCityAdded, setIsNewCityAdded] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Loading history from local storage when the app initializes
  useEffect(() => {
    const loadedHistory = localStorage.getItem('cityHistory');
    if (loadedHistory) {
      setCityHistory(JSON.parse(loadedHistory));
    }
  }, []);

  // Storing history in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
  }, [cityHistory]); 
  
  const handleAddCity = async () => {
    const coordinates = await getCoordinatesForCity(city);
    if (coordinates) {
      setCities([...cities, { name: city, coordinates }]);
      // Update the cityHistory state with the new city and current timestamp
      setCityHistory(prevHistory => [...prevHistory, {cityName: city, timestamp: new Date(), coordinates: coordinates}]);
      setIsNewCityAdded(true);  // Set to true after adding city
    } else {
      alert('Unable to find city. Please try another name.');
    }
  };

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container className={`container ${darkMode ? 'dark' : ''}`}>
          <Input 
            placeholder="Enter city name"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <Button className="add-city-button" onClick={handleAddCity}>Dash To Location</Button>
          <div className={`content container ${darkMode ? 'dark' : ''}`}>
            <MapContainer className='map-container' center={position} zoom={10} style={{ width: '1200px', height: '600px', marginTop: '20px', borderRadius: '8px', overflow: 'hidden' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {cities.map((cityData, idx) => (
                <Marker key={idx} position={cityData.coordinates} icon={defaultIcon}>
                  <Popup>{cityData.name}</Popup>
                </Marker>
              ))}
              {cities.length > 0 && <PanToNewCity coordinates={cities[cities.length - 1].coordinates} />}
              {positions.length > 1 && <Polyline positions={positions} color="blue" dashArray="5,5" />}
            </MapContainer>
            <CityTimeline className='city-timeline' history={cityHistory} />
          </div>
        </Container>
    </div>
  );
}

export default App;
