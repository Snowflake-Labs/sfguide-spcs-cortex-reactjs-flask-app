import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Collapse } from 'react-collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { BeatLoader } from 'react-spinners';

const baseURL = window.location.href;
console.log('baseURL: '+baseURL)

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
      <h1>Snowday: Dash To Location</h1>
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>
    </div>
  );
}

function CityTimeline({ history, highlightedCity }) {
  return (
    <div>
      <h4>Timeline</h4>
      <ul>
        {history.map((item, index) => (
          <li key={index} className={item.cityName === highlightedCity ? 'highlighted' : ''}>
            {item.timestamp} : {item.cityName}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getPolylinePositions(cities) {
  let positions = [];
  for (let i = 1; i < cities.length; i++) {
    positions.push([cities[i-1].coordinates, cities[i].coordinates]);
  }
  return positions;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  }).format(date);
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cityHistory, setCityHistory] = useState([]);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [position] = useState([39.8283, -98.5795]); // Center of the contiguous United States
  const [zoom] = useState(4); // Adjust the zoom level as necessary
  const positions = cities.map(cityData => cityData.coordinates);
  const [isNewCityAdded, setIsNewCityAdded] = useState(false);
  const mapRef = useRef();
  const [connectedCitiesCount, setConnectedCitiesCount] = useState(-1);
  const polylinePositions = getPolylinePositions(cities);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false); // Assuming the timeline starts collapsed
  const [activeSection, setActiveSection] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [highlightedCity, setHighlightedCity] = useState(null);
  const [cityInfo, setCityInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState({}); // This state will store loading status for each city

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

  // Load cities from the backend
  useEffect(() => {
    fetch(baseURL + 'cities')
    .then(response => response.json())
    .then(data => {
        setCities(data);
        const history = data.map(city => ({
            cityName: city.name,
            timestamp: formatDate(new Date())
        }));
        setCityHistory(history);
    })
    .catch(error => {
        console.error("Error fetching cities:", error);
    });
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const getCityInfo = async (cityName) => {
    try {
      const response = await axios.post(baseURL + 'llmpfs', {
        cityName: cityName
      });
      const cityInfo = response.data[0].llmpfs_response;
      // Do something with the cityInfo here, like updating your component state
      return cityInfo;
    } catch (error) {
      console.error('Error fetching city info', error);
      return null;
    }
  };  
  
  const isCityInUS = (coordinates) => {
    // Rough bounding box for continental US
    const US_BOUNDS = {
        lat: {
            min: 24.396308,
            max: 49.384358
        },
        lng: {
            min: -125.001650,
            max: -66.934570
        }
    };

    const { lat, lng } = coordinates;
    return (
        lat >= US_BOUNDS.lat.min && lat <= US_BOUNDS.lat.max &&
        lng >= US_BOUNDS.lng.min && lng <= US_BOUNDS.lng.max
    );
  }

  const handleAddCity = async () => {
    const coordinates = await getCoordinatesForCity(city);
    if (coordinates) {
      setCities([...cities, { name: city, coordinates }]);
      // Update the cityHistory state with the new city and current timestamp
      setCityHistory(prevHistory => [...prevHistory, {cityName: city, timestamp: formatDate(new Date()), coordinates: coordinates}]);
      setIsNewCityAdded(true);  // Set to true after adding city
      // After setting the city in state, check if it's outside the current view
      if (mapRef.current && coordinates) {
        const bounds = mapRef.current.getBounds();
        if (!bounds.contains(coordinates)) {
          const zoomLevel = isCityInUS(coordinates) ? 10 : 2;
          mapRef.current.flyTo(coordinates, zoomLevel);
        }
      }
      // Update the highlightedCity state with the new city
      setHighlightedCity(city);
      // Reset the highlighted city after a delay (e.g., 2 seconds)
      setTimeout(() => setHighlightedCity(null), 2000);
    } else {
      alert('Please enter a valid city name.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddCity();
    }
  };  

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container className={`container ${darkMode ? 'dark' : ''}`}>
          <div>
            <Input 
              placeholder="Enter a city name"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              className='city-input'
            />
            <Button className="add-city-button" onClick={handleAddCity}>Dash To Location</Button>
          </div>
          <div className={`content container ${darkMode ? 'dark' : ''}`}>
            <MapContainer className='map-container' ref={mapRef} whenCreated={mapInstance => mapRef.current = mapInstance} center={position} zoom={zoom} style={{ width: '1200px', height: '600px', marginTop: '20px', borderRadius: '8px', overflow: 'hidden' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {cities.map((cityData, idx) => (
                  <Marker key={idx} position={cityData.coordinates} icon={defaultIcon}
                      eventHandlers={{
                          click: async () => {
                              if(mapRef.current) {
                                  setLoadingCities((prevLoading) => ({ ...prevLoading, [cityData.name]: true }));
                                  const info = await getCityInfo(cityData.name);
                                  if (info) {
                                      setCityInfo({ ...cityInfo, [cityData.name]: info });
                                  }
                                  setLoadingCities((prevLoading) => ({ ...prevLoading, [cityData.name]: false }));
                              }
                          }
                      }}
                  >
                  <Popup>
                      <strong>{cityData.name}</strong><br />
                      {cityData.coordinates[0]}&nbsp;&nbsp;{cityData.coordinates[1]}<br />
                      
                      {loadingCities[cityData.name] ? (
                          <BeatLoader color="#3498db" size={8} />
                      ) : (
                          cityInfo[cityData.name] && <div>{cityInfo[cityData.name]}</div>
                      )}
                  </Popup>
                  </Marker>
              ))}
              {/* {cities.length > 0 && <PanToNewCity coordinates={cities[cities.length - 1].coordinates} />} */}
              {/* {positions.length > 1 && <Polyline positions={cities.slice(0, connectedCitiesCount + 2).map(cityData => cityData.coordinates)} color="#13C2C2" dashArray="5,5"/>} */}
              {positions.length > 1 && <Polyline positions={positions} color="#13C2C2" dashArray="5,5"/>}
            </MapContainer>
            <button onClick={() => setActiveSection('timeline')}>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} onClick={toggle}/>
            </button>
            <Collapse isOpened={isOpen}>
              <div className={`city-timeline ${darkMode ? 'dark' : ''}`}>
                <CityTimeline history={cityHistory} highlightedCity={highlightedCity} />
              </div>
            </Collapse>
          </div>
        </Container>
    </div>
  );
}

export default App;