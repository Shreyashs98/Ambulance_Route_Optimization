import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import haversine from 'haversine-distance';
import { getAllAmbulances } from './services/api';
import './AssignAmbulance.css';

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
    if (!mapRef.current) {
      console.error('Map container not found!');
      return;
    }

    // Initialize map with default center and zoom
    const initMap = L.map(mapRef.current).setView([28.2380, 83.9956], 11);

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Leaflet &copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(initMap);

    setMap(initMap);

    const destinationIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/12207/12207498.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });

    // Get user location
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
          initMap.setView(userCoords, 13);

          const destMarker = L.marker(userCoords, { icon: destinationIcon, draggable: true })
            .addTo(initMap)
            .bindPopup('Destination')
            .openPopup();
          setDestinationMarker(destMarker);

          destMarker.on('dragend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            setDestinationLocation([lat, lng]);
            handleFindNearestAmbulance();
          });

          initMap.on('click', (e) => {
            const { lat, lng } = e.latlng;
            destMarker.setLatLng([lat, lng]).update();
            setDestinationLocation([lat, lng]);
            handleFindNearestAmbulance();
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    };

    getUserLocation();

    return () => {
      if (initMap) {
        initMap.off();
        initMap.remove();
      }
    };
  }, []);

  const handleFindNearestAmbulance = async () => {
    if (!userLocation || !destinationLocation) return;

    const ambulanceIcon = L.icon({
      iconUrl: 'https://w7.pngwing.com/pngs/760/500/png-transparent-white-ambulance-ambulance-nontransporting-ems-vehicle-ambulance-compact-car-car-mode-of-transport-thumbnail.png',
      iconSize: [70, 70],
    });

    try {
      const ambulances = await getAllAmbulances();

      let closestAmbulance = null;
      let shortestDistance = Infinity;

      ambulances.forEach((ambulance) => {
        const ambulanceCoords = [ambulance.location.coordinates[1], ambulance.location.coordinates[0]];
        const distance = haversine(destinationLocation, ambulanceCoords);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestAmbulance = ambulance;
        }
      });

      if (closestAmbulance) {
        setNearestAmbulance(closestAmbulance);

        if (ambulanceMarker) {
          map.removeLayer(ambulanceMarker);
        }

        const marker = L.marker(
          [closestAmbulance.location.coordinates[1], closestAmbulance.location.coordinates[0]],
          { icon: ambulanceIcon }
        ).addTo(map).bindPopup(`Ambulance: ${closestAmbulance.numberPlate}`).openPopup();

        setAmbulanceMarker(marker);

        marker.on('click', () => {
          setShowAssignButton(true);
        });
      }
    } catch (error) {
      console.error('Error fetching ambulances:', error);
    }
  };

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
    <div className="map-container">
      <div ref={mapRef} className="map" />
      <button className="find-button" onClick={handleFindNearestAmbulance}>Find Nearest Ambulance</button>
      {showAssignButton && (
        <button className="assign-button" onClick={handleAssignAmbulance}>Assign Ambulance</button>
      )}
    </div>
  );
};

export default AssignAmbulance;
