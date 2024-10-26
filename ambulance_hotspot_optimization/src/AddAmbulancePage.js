import React, { useState } from 'react';
import { createAmbulance } from './services/api';

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
                        type="number"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Longitude:
                    <input
                        type="number"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
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
};

export default AddAmbulancePage;
