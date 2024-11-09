import React, { useState } from 'react';
import axios from 'axios';
import './HotspotUpload.css'; // Import the external CSS file

const HotspotUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [numAmbulances, setNumAmbulances] = useState(1); // Default to 1 ambulance
  const [mapUrl, setMapUrl] = useState(null);

  // Handle file selection
  const onFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // Handle num_ambulances input change
  const onNumAmbulancesChange = (e) => {
    setNumAmbulances(e.target.value);
  };

  // Handle form submission (upload the file)
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      alert('Please select a CSV file first');
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', csvFile);
    formData.append('num_ambulances', numAmbulances); // Append num_ambulances

    try {
      // Send POST request to Flask server
      const response = await axios.post('https://09b46591-1623-45ad-bae4-ae6837808c85-00-18ajhpjsfa65l.sisko.replit.dev/hotspots', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Expecting a file (HTML)
      });

      // Create a URL from the received blob and set it to display
      const mapBlob = response.data;
      const mapUrl = URL.createObjectURL(mapBlob);
      setMapUrl(mapUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Upload Accident Data CSV</h2>
        <form onSubmit={onSubmit} className="upload-form">
          <div className="input-group">
            <input type="file" onChange={onFileChange} accept=".csv" className="dropdown" />
          </div>
          <div className="input-group">
            <label className="dropdown-label">Number of Ambulances:</label>
            <input
              type="number"
              value={numAmbulances}
              onChange={onNumAmbulancesChange}
              min="1"
              max="10"
              className="dropdown"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button">Generate Map</button>
          </div>
        </form>

        {mapUrl && (
          <div className="map-container">
            <h3 className="mapHeading">Accident Hotspot Map</h3>
            <iframe src={mapUrl} width="100%" height="500px" title="Accident Hotspot Map"></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotspotUpload;
