import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getAllAmbulances } from './services/api'; // Ensure this path is correct

// Custom icon for the ambulance marker
const ambulanceIcon = new L.Icon({
    iconUrl: 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png',
    iconSize: [30, 30], // Size of the icon
});

// Custom icon for the user's location marker
const userLocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/12207/12207498.png', // Your marker image URL
    iconSize: [40, 40], // Adjust size according to your preference
});

const AssignAmbulance = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [ambulances, setAmbulances] = useState([]);
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);
    const [route, setRoute] = useState([]);
    const [currentAmbulancePosition, setCurrentAmbulancePosition] = useState(null);
    const [animationInterval, setAnimationInterval] = useState(null);
    const [destination, setDestination] = useState(null); // State to hold the destination

    useEffect(() => {
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

    useEffect(() => {
        const fetchAmbulances = async () => {
            try {
                const data = await getAllAmbulances();
                setAmbulances(data);
            } catch (error) {
                setError('Error retrieving ambulances.');
            }
        };

        fetchAmbulances();
    }, []);

    const findNearestAmbulance = () => {
        if (userLocation) {
            let nearest = null;
            let shortestDistance = Infinity;

            ambulances.forEach((ambulance) => {
                if (ambulance.available) {
                    const distance = calculateDistance(userLocation, {
                        lat: ambulance.location.coordinates[1],
                        lng: ambulance.location.coordinates[0],
                    });
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearest = ambulance;
                    }
                }
            });

            setSelectedAmbulance(nearest);
        }
    };

    const calculateDistance = (loc1, loc2) => {
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

    const handleSubmit = async () => {
        if (selectedAmbulance && destination) {
            alert(`Ambulance assigned: ${selectedAmbulance.numberPlate}`);
            
            const updatedAmbulance = { ...selectedAmbulance, available: false };
            setAmbulances((prevAmbulances) => 
                prevAmbulances.map(ambulance => 
                    ambulance._id === selectedAmbulance._id ? updatedAmbulance : ambulance
                )
            );

            // Calculate the route to the destination
            await calculateRoute({
                lat: selectedAmbulance.location.coordinates[1],
                lng: selectedAmbulance.location.coordinates[0],
            }, destination);

            // Start animating the ambulance
            animateAmbulance();
        } else {
            alert('No ambulance selected or destination not set.');
        }
    };

    const calculateRoute = async (origin, destination) => {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full`);
        
        if (response.ok) {
            const data = await response.json();
            const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRoute(routeCoordinates);
        } else {
            console.error('Error fetching route:', response.statusText);
        }
    };

    const animateAmbulance = () => {
        if (!route.length) return;
    
        const speed = 90; // Adjust this value to increase or decrease speed (in degrees per second)
        let currentIndex = 0;
        let currentPosition = [route[0][0], route[0][1]]; // Start position
        setCurrentAmbulancePosition(currentPosition);
    
        const interval = setInterval(() => {
            if (currentIndex < route.length - 1) {
                // Calculate distance to next point
                const nextPoint = route[currentIndex + 1];
                const latDiff = nextPoint[0] - currentPosition[0];
                const lngDiff = nextPoint[1] - currentPosition[1];
    
                // Calculate distance between points
                const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
                // If distance is less than the speed, move to next point
                if (distance < speed) {
                    currentPosition = nextPoint;
                    currentIndex++;
                } else {
                    // Move towards the next point based on speed
                    currentPosition[0] += (latDiff / distance) * speed; // Move in latitude
                    currentPosition[1] += (lngDiff / distance) * speed; // Move in longitude
                }
    
                setCurrentAmbulancePosition([...currentPosition]);
            } else {
                clearInterval(interval);
                setCurrentAmbulancePosition(null); // Reset position when done
            }
        }, 100); // Set interval time (in milliseconds)
    
        setAnimationInterval(interval);
    };

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setDestination({ lat, lng }); // Set the destination from the map click
        alert(`Destination set at: ${lat}, ${lng}`); // Notify the user of the destination
    };

    return (
        <div style={styles.container}>
            <h2>Assign Ambulance</h2>

            {error && <p style={styles.error}>{error}</p>}

            {userLocation ? (
                <div style={styles.mapContainer}>
                    <MapContainer 
                        center={userLocation} 
                        zoom={13} 
                        style={{ height: '400px', width: '100%' }} 
                        onClick={handleMapClick} // Handle map click
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={userLocation} icon={userLocationIcon}> {/* Use custom user location icon */}
                            <Popup>You are here</Popup>
                        </Marker>
                        {selectedAmbulance && (
                            <Marker
                                position={{
                                    lat: selectedAmbulance.location.coordinates[1],
                                    lng: selectedAmbulance.location.coordinates[0],
                                }}
                                icon={ambulanceIcon}
                            >
                                <Popup>{selectedAmbulance.numberPlate}</Popup>
                            </Marker>
                        )}
                        {currentAmbulancePosition && (
                            <Marker
                                position={currentAmbulancePosition}
                                icon={ambulanceIcon}
                            >
                                <Popup>Ambulance is on the way!</Popup>
                            </Marker>
                        )}
                        {route.length > 0 && (
                            <Polyline positions={route} color="blue" />
                        )}
                    </MapContainer>
                    <button style={styles.button} onClick={findNearestAmbulance}>
                        Find Nearest Ambulance
                    </button>
                </div>
            ) : (
                <p>Loading your location...</p>
            )}

            {selectedAmbulance && (
                <div>
                    <h3>Selected Ambulance: {selectedAmbulance.numberPlate}</h3>
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
        padding: '20px',
    },
    mapContainer: {
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#28a745',
        color: '#fff',
        borderRadius: '5px',
        fontSize: '16px',
    },
    error: {
        color: 'red',
    },
};

export default AssignAmbulance;
