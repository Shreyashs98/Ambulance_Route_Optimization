import React, { useState, useEffect } from 'react';
import { getAllAccidents } from './services/api';
import axios from 'axios';

const API_KEY = '15ee415d2b9846aaa7e0da1261cd65c5'; // Replace with your actual OpenCage API key

const LogsPage = () => {
    const [accidentLogs, setAccidentLogs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccidentLogs = async () => {
            try {
                setLoading(true);
                const data = await getAllAccidents();
                
                // Map through accident logs to add addresses
                const logsWithAddresses = await Promise.all(data.map(async log => {
                    const address = await getAddress(log.location.coordinates);
                    return { ...log, address };
                }));

                setAccidentLogs(logsWithAddresses);
            } catch (error) {
                setError('Failed to fetch accident logs');
                console.error('Error fetching accident logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccidentLogs();
    }, []);

    // Reverse geocode function to get address from coordinates
    const getAddress = async (coordinates) => {
        const [lng, lat] = coordinates;
        try {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: {
                    q: `${lat},${lng}`,
                    key: API_KEY,
                },
            });
            return response.data.results[0]?.formatted || 'Address not found';
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Error fetching address';
        }
    };

    const totalAccidents = accidentLogs.length;

    return (
        <div style={styles.container}>
            <h2>Accident Logs</h2>
            <h3>Total Number of Accidents: {totalAccidents}</h3>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Accident Location (Address)</th>
                            <th style={styles.tableHeader}>Accident Description</th>
                            <th style={styles.tableHeader}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accidentLogs.map(log => (
                            <tr key={log._id}>
                                <td style={styles.tableCell}>{log.address}</td>
                                <td style={styles.tableCell}>{log.description}</td>
                                <td style={styles.tableCell}>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default LogsPage;
