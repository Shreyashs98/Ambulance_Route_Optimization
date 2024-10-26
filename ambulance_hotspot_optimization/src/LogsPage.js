import React from 'react';

// Sample data
const accidentLogs = [
    { id: 1, accidentId: 'ACC123', ambulanceNumber: 'KA-01-AB-1234', timestamp: '2024-10-26 10:30 AM' },
    { id: 2, accidentId: 'ACC124', ambulanceNumber: 'KA-02-CD-5678', timestamp: '2024-10-26 11:15 AM' },
    { id: 3, accidentId: 'ACC125', ambulanceNumber: 'KA-03-EF-9101', timestamp: '2024-10-26 12:00 PM' },
    // Add more logs as needed
];

const LogsPage = () => {
    const totalAccidents = accidentLogs.length; // Total number of accidents

    return (
        <div style={styles.container}>
            <h2>Accident Logs</h2>
            <h3>Total Number of Accidents: {totalAccidents}</h3>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Accident ID</th>
                        <th style={styles.tableHeader}>Ambulance Number</th>
                        <th style={styles.tableHeader}>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {accidentLogs.map(log => (
                        <tr key={log.id}>
                            <td style={styles.tableCell}>{log.accidentId}</td>
                            <td style={styles.tableCell}>{log.ambulanceNumber}</td>
                            <td style={styles.tableCell}>{log.timestamp}</td>
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

export default LogsPage;
