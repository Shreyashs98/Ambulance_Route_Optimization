import React from 'react';

// Sample ambulance data
const ambulances = [
    { id: 1, numberPlate: 'KA-01-AB-1234', imageUrl: 'https://via.placeholder.com/100' },
    { id: 2, numberPlate: 'KA-02-CD-5678', imageUrl: 'https://via.placeholder.com/100' },
    { id: 3, numberPlate: 'KA-03-EF-9101', imageUrl: 'https://via.placeholder.com/100' },
    // Add more ambulance data as needed
];

const AssignAmbulancePage = () => {
    const availableSlots = ambulances.length; // Number of available ambulances

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Ambulance Slot: {availableSlots}</h2>
            <div style={styles.dashboard}>
                <div style={styles.leftPanel}>
                    {ambulances.map((ambulance) => (
                        <div key={ambulance.id} style={styles.ambulanceCard}>
                            <img src={ambulance.imageUrl} alt={`Ambulance ${ambulance.numberPlate}`} style={styles.ambulanceImage} />
                            <p style={styles.numberPlate}>{ambulance.numberPlate}</p>
                        </div>
                    ))}
                </div>
                <div style={styles.rightPanel}>
                    <h3 style={styles.mapHeading}>Map</h3>
                    {/* Placeholder for map */}
                    <div style={styles.mapPlaceholder}>
                        {/* Replace this with an actual map component */}
                        <p style={styles.mapText}>Map showing ambulance locations will go here.</p>
                    </div>
                </div>
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
    mapPlaceholder: {
        width: '100%',
        height: '400px',
        backgroundColor: '#eaeaea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
    },
    mapText: {
        color: '#666',
    },
};

export default AssignAmbulancePage;
