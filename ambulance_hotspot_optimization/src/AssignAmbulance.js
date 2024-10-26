import React, { useEffect, useState } from 'react';

// Dummy ambulance data for example
const ambulances = [
    { id: 1, numberPlate: 'KA-01-AB-1234', location: { lat: 12.9716, lng: 77.5946 } }, // Example locations
    { id: 2, numberPlate: 'KA-02-CD-5678', location: { lat: 12.2958, lng: 76.6394 } },
    { id: 3, numberPlate: 'KA-03-EF-9101', location: { lat: 13.0827, lng: 80.2707 } },
];

const AssignAmbulance = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);

    useEffect(() => {
        // Get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (err) => {
                    setError('Unable to retrieve your location.');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }, []);

    const findNearestAmbulance = () => {
        if (userLocation) {
            let nearest = ambulances[0];
            let shortestDistance = Infinity;

            ambulances.forEach((ambulance) => {
                const distance = calculateDistance(userLocation, ambulance.location);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearest = ambulance;
                }
            });

            setSelectedAmbulance(nearest);
        }
    };

    const calculateDistance = (loc1, loc2) => {
        // Haversine formula to calculate distance between two lat/lng points
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
        const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) * 
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    const handleSubmit = () => {
        if (selectedAmbulance) {
            alert(`Ambulance assigned: ${selectedAmbulance.numberPlate}`);
            // Proceed with the ambulance assignment logic (e.g., API call)
        } else {
            alert('No ambulance selected.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Assign Ambulance</h2>

            {error && <p style={styles.error}>{error}</p>}

            {userLocation ? (
                <div style={styles.mapContainer}>
                    <h3>Your Location</h3>
                    <div style={styles.mapPlaceholder}>
                        {/* Placeholder for map */}
                        <p style={styles.mapText}>
                            Your location (lat: {userLocation.lat.toFixed(4)}, lng: {userLocation.lng.toFixed(4)})
                        </p>
                    </div>
                    <button style={styles.button} onClick={findNearestAmbulance}>
                        Find Nearest Ambulance
                    </button>
                </div>
            ) : (
                <p>Loading your location...</p>
            )}

            {selectedAmbulance && (
                <div style={styles.resultContainer}>
                    <h3>Nearest Ambulance</h3>
                    <p>Number Plate: {selectedAmbulance.numberPlate}</p>
                    <button style={styles.button} onClick={handleSubmit}>
                        Assign Ambulance
                    </button>
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
    mapContainer: {
        width: '100%',
        maxWidth: '600px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    mapPlaceholder: {
        height: '200px',
        backgroundColor: '#eaeaea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
    },
    mapText: {
        color: '#666',
    },
    button: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    error: {
        color: 'red',
    },
    resultContainer: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
};

export default AssignAmbulance;
