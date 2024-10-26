import React from 'react';

// Sample accident log data
const accidentLogs = [
    { id: 1, accidentId: 'ACC123', location: 'Location A', timestamp: '2024-10-26 10:30 AM', ambulanceAssigned: 'KA-01-AB-1234', status: 'Dispatched' },
    { id: 2, accidentId: 'ACC124', location: 'Location B', timestamp: '2024-10-26 11:15 AM', ambulanceAssigned: 'KA-02-CD-5678', status: 'On Scene' },
    { id: 3, accidentId: 'ACC125', location: 'Location C', timestamp: '2024-10-26 12:00 PM', ambulanceAssigned: 'KA-03-EF-9101', status: 'Completed' },
    // Add more logs as needed
];

const AccidentLogPage = () => {
    return (
        <div style={styles.container}>
            <h2>Accident Log</h2>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Accident ID</th>
                        <th style={styles.tableHeader}>Location</th>
                        <th style={styles.tableHeader}>Timestamp</th>
                        <th style={styles.tableHeader}>Ambulance Assigned</th>
                        <th style={styles.tableHeader}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {accidentLogs.map(log => (
                        <tr key={log.id}>
                            <td style={styles.tableCell}>{log.accidentId}</td>
                            <td style={styles.tableCell}>{log.location}</td>
                            <td style={styles.tableCell}>{log.timestamp}</td>
                            <td style={styles.tableCell}>{log.ambulanceAssigned}</td>
                            <td style={styles.tableCell}>{log.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
    table: {
        width: '80%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    tableHeader: {
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#f2f2f2',
        textAlign: 'left',
    },
    tableCell: {
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'left',
    },
};

export default AccidentLogPage;
