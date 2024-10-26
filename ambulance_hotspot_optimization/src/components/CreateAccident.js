import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createAccident } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CreateAccident.css';

const accidentIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/12207/12207498.png',
    iconSize: [50, 50],
});

const CreateAccident = () => {
    const defaultLatitude = 12.871216912602229;
    const defaultLongitude = 74.92830276489259;

    const [location, setLocation] = useState({ type: 'Point', coordinates: [defaultLongitude, defaultLatitude] });
    const [description, setDescription] = useState('');
    const [notification, setNotification] = useState('');
    const [mapCenter, setMapCenter] = useState([defaultLatitude, defaultLongitude]);
    const [markerPosition, setMarkerPosition] = useState([defaultLatitude, defaultLongitude]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setMapCenter([latitude, longitude]);
                        setMarkerPosition([latitude, longitude]);
                        setLocation({ type: 'Point', coordinates: [longitude, latitude] });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        setNotification("Unable to retrieve your location. Default location will be used.");
                    }
                );
            }
        };

        getCurrentLocation();
    }, []);

    const handleMarkerDrag = (e) => {
        const { lat, lng } = e.target.getLatLng();
        setMarkerPosition([lat, lng]);
        setLocation({ type: 'Point', coordinates: [lng, lat] });
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1`);
        const data = await response.json();
        setSearchResults(data);
    };

    const handleSelectLocation = (result) => {
        const { lat, lon } = result;
        setMarkerPosition([lat, lon]);
        setLocation({ type: 'Point', coordinates: [lon, lat] });
        setMapCenter([lat, lon]);
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accidentData = { location, description };

        try {
            const result = await createAccident(accidentData);
            console.log('Accident created:', result);
            setNotification('Accident created successfully!');
            setDescription('');

            // Navigate to Assign Ambulance page and pass the accident location
            navigate('/assign-ambulance', { state: { accidentLocation: location.coordinates } });
        } catch (error) {
            console.error('Error creating accident:', error);
            setNotification('Error creating accident. Please try again.');
        }
    };

    return (
        <div className="accident-form-container">
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
            <form onSubmit={handleSubmit} className="accident-form">
                <h2>Create Accident</h2>
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="description-input"
                />
                <input
                    type="text"
                    placeholder="Search Location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                    className="search-input"
                />
                {searchResults.length > 0 && (
                    <ul className="search-results">
                        {searchResults.map((result) => (
                            <li key={result.place_id} onClick={() => handleSelectLocation(result)}>
                                {result.display_name}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="map-container">
                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        style={{ height: '300px', width: '100%' }}
                        draggable={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={markerPosition}
                            icon={accidentIcon}
                            draggable={true}
                            eventHandlers={{
                                dragend: handleMarkerDrag,
                            }}
                        >
                            <Popup>
                                <span>Drag me to change location!</span>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <button type="submit" className="submit-button">Create Accident</button>
            </form>
        </div>
    );
};

export default CreateAccident;
