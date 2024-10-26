import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAllAmbulances } from './services/api';

// Setting up custom icon for ambulances
const ambulanceIcon = new L.Icon({
    iconUrl: 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png', // Replace with the URL of your custom ambulance icon
    iconSize: [30, 30], // Adjust icon size as needed
});

const AssignAmbulancePage = () => {
    const [ambulances, setAmbulances] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAmbulances = async () => {
            try {
                setLoading(true);
                const data = await getAllAmbulances();
                console.log('Ambulance data:', data); // Log data for debugging
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

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Ambulance Slot: {ambulances.length}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : (
                <div style={styles.dashboard}>
                    <div style={styles.leftPanel}>
                        {ambulances.map((ambulance) => (
                            <div key={ambulance._id} style={styles.ambulanceCard}>
                                <img src={ambulance.imageUrl || 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png'} alt={`Ambulance ${ambulance.numberPlate}`} style={styles.ambulanceImage} />
                                <p style={styles.numberPlate}>{ambulance.numberPlate}</p>
                            </div>
                        ))}
                    </div>
                    <div style={styles.rightPanel}>
                        <h3 style={styles.mapHeading}>Map</h3>
                        <MapContainer
                            center={[12.9716, 77.5946]} // Default center, adjust if needed
                            zoom={12}
                            style={styles.mapContainer}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {ambulances.map((ambulance) => {
                                const [lng, lat] = ambulance.location.coordinates; // Use coordinates for each marker
                                return (
                                    <Marker
                                        key={ambulance._id}
                                        position={[lat, lng]}
                                        icon={ambulanceIcon}
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
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    heading: {
        marginBottom: '20px',
    },
    dashboard: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
    },
    leftPanel: {
        flex: 1,
        marginRight: '20px',
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
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    ambulanceImage: {
        width: '100px',
        height: 'auto',
        marginBottom: '5px',
    },
    numberPlate: {
        fontWeight: 'bold',
    },
    rightPanel: {
        flex: 1,
        marginLeft: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    mapHeading: {
        marginBottom: '10px',
    },
    mapContainer: {
        width: '100%',
        height: '400px',
        borderRadius: '5px',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default AssignAmbulancePage;
