// src/components/CreateAccident.js
import React, { useState } from 'react';
import { createAccident } from '../services/api';
import './CreateAccident.css'; // Import CSS for additional styles

const CreateAccident = () => {
    const [location, setLocation] = useState({ type: 'Point', coordinates: [0, 0] });
    const [description, setDescription] = useState('');
    const [notification, setNotification] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accidentData = { location, description };

        try {
            const result = await createAccident(accidentData);
            console.log('Accident created:', result);
            // Set success notification
            setNotification('Accident created successfully!');
            // Optionally, reset the form
            setDescription('');
            setLocation({ type: 'Point', coordinates: [0, 0] });
        } catch (error) {
            console.error('Error creating accident:', error);
            // Set error notification
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
                <div className="coordinates-inputs">
                    <input
                        type="number"
                        placeholder="Latitude"
                        onChange={(e) => setLocation({ ...location, coordinates: [location.coordinates[0], parseFloat(e.target.value)] })}
                        required
                        className="coordinate-input"
                    />
                    <input
                        type="number"
                        placeholder="Longitude"
                        onChange={(e) => setLocation({ ...location, coordinates: [parseFloat(e.target.value), location.coordinates[1]] })}
                        required
                        className="coordinate-input"
                    />
                </div>
                <button type="submit" className="submit-button">Create Accident</button>
            </form>
        </div>
    );
};

export default CreateAccident;
