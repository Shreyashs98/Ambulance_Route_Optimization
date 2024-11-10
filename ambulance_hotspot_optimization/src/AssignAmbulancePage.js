import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllAmbulances } from './services/api';
import './styles.css';

// Icons for default and selected ambulance
const ambulanceIcon = new L.Icon({
    iconUrl: 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png',
    iconSize: [30, 30],
});

const selectedAmbulanceIcon = new L.Icon({
    iconUrl: 'https://th.bing.com/th/id/OIP.U1twZqLpWFXzwbwwDllpoAHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    iconSize: [35, 35],
});

const AssignAmbulancePage = () => {
    const [ambulances, setAmbulances] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5);
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);
    const navigate = useNavigate();
    const mapRef = useRef();

    useEffect(() => {
        const fetchAmbulances = async () => {
            try {
                setLoading(true);
                const data = await getAllAmbulances();
                setAmbulances(data);
            } catch (error) {
                setError('Failed to load ambulance data');
                console.error('Error fetching ambulances:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAmbulances();
    }, []);

    const handleAddAmbulanceClick = () => {
        navigate('/add-ambulance');
    };

    const handleShowMore = () => {
        setVisibleCount(prevCount => prevCount + 5);
    };

    const handleAmbulanceClick = (ambulance) => {
        setSelectedAmbulance(ambulance);
        const map = mapRef.current;
        if (map) {
            const [lng, lat] = ambulance.location.coordinates;
            map.setView([lat, lng], 15); // Adjust zoom level as needed
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Ambulance Slot: {ambulances.length}</h2>
            <button onClick={handleAddAmbulanceClick} style={styles.addButton}>Add Ambulance</button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : (
                <div style={styles.dashboard}>
                    <div style={styles.leftPanel}>
                        {ambulances.slice(0, visibleCount).map((ambulance) => (
                            <div
                                key={ambulance._id}
                                style={{
                                    ...styles.ambulanceCard,
                                    border: selectedAmbulance?._id === ambulance._id ? '2px solid #007BFF' : '1px solid #ccc',
                                }}
                                onClick={() => handleAmbulanceClick(ambulance)}
                            >
                                <img
                                    src={ambulance.imageUrl || 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png'}
                                    alt={`Ambulance ${ambulance.numberPlate}`}
                                    style={styles.ambulanceImage}
                                />
                                <p style={styles.numberPlate}>{ambulance.numberPlate}</p>
                            </div>
                        ))}
                        {visibleCount < ambulances.length && (
                            <button onClick={handleShowMore} style={styles.moreButton}>More</button>
                        )}
                    </div>
                    <div style={styles.rightPanel}>
                        <h3 style={styles.mapHeading}>Map</h3>
                        <MapContainer
                            center={[12.9716, 77.5946]}
                            zoom={12}
                            style={styles.mapContainer}
                            ref={mapRef}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {ambulances.map((ambulance) => {
                                const [lng, lat] = ambulance.location.coordinates;
                                const isSelected = selectedAmbulance?._id === ambulance._id;
                                return (
                                    <Marker
                                        key={ambulance._id}
                                        position={[lat, lng]}
                                        icon={isSelected ? selectedAmbulanceIcon : ambulanceIcon}
                                    >
                                        <Popup>
                                            <p><strong>Number Plate:</strong> {ambulance.numberPlate}</p>
                                            <p><strong>Status:</strong> {ambulance.available ? 'Available' : 'Not Available'}</p>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    heading: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    addButton: {
        marginBottom: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dashboard: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '1200px',
        gap: '20px',
    },
    leftPanel: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
    },
    ambulanceCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '300px',
    },
    ambulanceImage: {
        width: '100px',
        height: 'auto',
        marginBottom: '5px',
    },
    numberPlate: {
        fontWeight: 'bold',
    },
    moreButton: {
        padding: '10px 20px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    rightPanel: {
        flex: 2,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        height: '500px',
    },
    mapHeading: {
        textAlign: 'center',
        padding: '10px 0',
    },
    mapContainer: {
        width: '100%',
        height: '450px',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default AssignAmbulancePage;
