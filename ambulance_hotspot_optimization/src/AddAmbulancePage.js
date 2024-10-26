import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { createAmbulance } from './services/api';

// Custom hook to handle map clicks and set latitude/longitude
const MapClickHandler = ({ setLatitude, setLongitude }) => {
    useMapEvents({
        click: (event) => {
            const { lat, lng } = event.latlng;
            setLatitude(lat);
            setLongitude(lng);
        },
    });

    return null;
};

const AddAmbulancePage = () => {
    const [numberPlate, setNumberPlate] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [available, setAvailable] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ambulance data object
        const ambulanceData = {
            numberPlate,
            location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            available,
        };

        try {
            const response = await createAmbulance(ambulanceData);
            setMessage(`Ambulance ${response.numberPlate} added successfully!`);
            setNumberPlate('');
            setLatitude('');
            setLongitude('');
            setAvailable(true);
            setError('');
        } catch (err) {
            setError('Failed to add ambulance');
            console.error(err);
            setMessage('');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Add New Ambulance</h2>
            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Number Plate:
                    <input
                        type="text"
                        value={numberPlate}
                        onChange={(e) => setNumberPlate(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Latitude:
                    <input
                        type="text" // Changed to text to allow for better UX
                        value={latitude}
                        readOnly
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Longitude:
                    <input
                        type="text" // Changed to text to allow for better UX
                        value={longitude}
                        readOnly
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Available:
                    <select
                        value={available}
                        onChange={(e) => setAvailable(e.target.value === 'true')}
                        style={styles.input}
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </label>
                <button type="submit" style={styles.button}>Add Ambulance</button>
            </form>
            <div style={styles.mapContainer}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapClickHandler setLatitude={setLatitude} setLongitude={setLongitude} />
                    {latitude && longitude && (
                        <Marker position={[latitude, longitude]}>
                            <Popup>Ambulance Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        height: '100vh',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        gap: '10px',
    },
    label: {
        fontSize: '16px',
        marginBottom: '5px',
    },
    input: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    success: {
        color: 'green',
        marginBottom: '15px',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
    mapContainer: {
        width: '100%',
        maxWidth: '600px',
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
};

export default AddAmbulancePage;
