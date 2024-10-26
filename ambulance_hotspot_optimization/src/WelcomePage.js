import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    // Handle dropdown navigation
    const handleDropdownSelection = (selection) => {
        switch (selection) {
            case 'profile':
                // Navigate to profile page or show profile details
                alert("Navigating to Profile page...");
                break;
            case 'home':
                navigate('/welcome'); // Reloads or navigates to home (welcome) page
                break;
            case 'logout':
                alert("Logging out...");
                navigate('/'); // Redirect to login page
                break;
            default:
                break;
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <label htmlFor="navDropdown" style={styles.dropdownLabel}>Navigation: </label>
                <select
                    id="navDropdown"
                    onChange={(e) => handleDropdownSelection(e.target.value)}
                    style={styles.dropdown}
                >
                    <option value="">Select</option>
                    <option value="profile">Profile</option>
                    <option value="home">Home</option>
                    <option value="logout">Logout</option>
                </select>
            </div>

            <h2>Welcome to the Dashboard</h2>
            <p>Select an option below to proceed.</p>

            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onClick={() => navigate('/available-ambulance')} // Navigate to Available Ambulance page
                >
                    Available Ambulance
                </button>
                <button
                    style={styles.button}
                    onClick={() => navigate('/report-accident')} // Navigate to Assign Ambulance page
                >
                    Report Accident
                </button>
                
                <button
                    style={styles.button}
                    onClick={() => navigate('/logs')} // Navigate to Logs page
                >
                    Check Reports
                </button>
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
    navbar: {
        position: 'absolute',
        top: '20px',
        right: '20px',
    },
    dropdownLabel: {
        marginRight: '8px',
        fontWeight: 'bold',
    },
    dropdown: {
        padding: '5px',
        fontSize: '16px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '20px',
        marginTop: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default WelcomePage;
