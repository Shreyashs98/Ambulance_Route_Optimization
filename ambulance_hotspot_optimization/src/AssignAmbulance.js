import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import haversine from 'haversine-distance';
import { getAllAmbulances } from './services/api';

const AssignAmbulance = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [nearestAmbulance, setNearestAmbulance] = useState(null);
  const [ambulanceMarker, setAmbulanceMarker] = useState(null);
  const [showAssignButton, setShowAssignButton] = useState(false);
  const [map, setMap] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  useEffect(() => {
    // Make sure the map container is available before initializing the map
    if (!mapRef.current) {
      console.error('Map container not found!');
      return;
    }

    // Initialize the map
    const initMap = L.map(mapRef.current).setView([28.2380, 83.9956], 11);

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet &copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(initMap);

    setMap(initMap);

    // Custom icon for destination marker
    const destinationIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/12207/12207498.png',
      iconSize: [50, 50],  // Adjust the size as needed
      iconAnchor: [25, 50],  // Set the anchor to the bottom of the icon
    });

    // Fetch user's geolocation
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userCoords);
          setDestinationLocation(userCoords);

          // Add draggable destination marker
          const destMarker = L.marker(userCoords, { icon: destinationIcon, draggable: true })
            .addTo(initMap)
            .bindPopup('Destination')
            .openPopup();
          setDestinationMarker(destMarker);

          // Listen for drag events on destination marker
          destMarker.on('dragend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            setDestinationLocation([lat, lng]);
            handleFindNearestAmbulance(); // Recalculate nearest ambulance based on new destination
          });

          // Click event on map to move destination marker
          initMap.on('click', (e) => {
            const { lat, lng } = e.latlng;
            destMarker.setLatLng([lat, lng]).update();
            setDestinationLocation([lat, lng]);
            handleFindNearestAmbulance(); // Recalculate nearest ambulance based on new destination
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    };

    // Get user's location
    getUserLocation();

    // Cleanup map on component unmount
    return () => {
      if (initMap) {
        initMap.off();
        initMap.remove();
      }
    };
  }, []);

  // Function to find the nearest ambulance based on user's location and destination
  const handleFindNearestAmbulance = async () => {
    if (!userLocation || !destinationLocation) return;

    console.log('Finding nearest ambulance...');
    const taxiIcon = L.icon({
      iconUrl: 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png',
      iconSize: [70, 70],
    });

    try {
      const ambulances = await getAllAmbulances();
      console.log('Ambulances:', ambulances);

      let closestAmbulance = null;
      let shortestDistance = Infinity;

      // Calculate distance to each ambulance
      ambulances.forEach((ambulance) => {
        const ambulanceCoords = [ambulance.location.coordinates[1], ambulance.location.coordinates[0]];
        const distance = haversine(destinationLocation, ambulanceCoords);

        console.log(`Distance to ambulance ${ambulance.numberPlate}: ${distance}`);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestAmbulance = ambulance;
        }
      });

      // Set nearest ambulance and add marker to the map
      if (closestAmbulance) {
        setNearestAmbulance(closestAmbulance);

        if (ambulanceMarker) {
          map.removeLayer(ambulanceMarker);
        }

        const marker = L.marker(
          [closestAmbulance.location.coordinates[1], closestAmbulance.location.coordinates[0]],
          { icon: taxiIcon }
        ).addTo(map).bindPopup(`Ambulance: ${closestAmbulance.numberPlate}`).openPopup();

        setAmbulanceMarker(marker);

        marker.on('click', () => {
          setShowAssignButton(true);
        });

        console.log('Nearest ambulance found:', closestAmbulance);
      } else {
        console.log('No ambulances found nearby.');
      }
    } catch (error) {
      console.error('Error fetching ambulances:', error);
    }
  };

  // Function to assign the ambulance and display the route
  const handleAssignAmbulance = () => {
    if (!ambulanceMarker || !nearestAmbulance || !destinationLocation) return;

    setShowAssignButton(false);

    L.Routing.control({
      waypoints: [
        L.latLng(nearestAmbulance.location.coordinates[1], nearestAmbulance.location.coordinates[0]),
        L.latLng(destinationLocation[0], destinationLocation[1]),
      ],
    }).on('routesfound', (e) => {
      const routes = e.routes[0].coordinates;
      routes.forEach((coord, index) => {
        setTimeout(() => {
          ambulanceMarker.setLatLng([coord.lat, coord.lng]);
        }, 100 * index);
      });
    }).addTo(map);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      <button 
        onClick={handleFindNearestAmbulance}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          zIndex: 1000,
        }}
      >
        Find Nearest Ambulance
      </button>
      {showAssignButton && (
        <button 
          onClick={handleAssignAmbulance}
          style={{
            position: 'absolute',
            top: '50px',
            left: '10px',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          Assign Ambulance
        </button>
      )}
    </div>
  );
};

export default AssignAmbulance;
