import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    // Handle dropdown navigation
    const handleDropdownSelection = (selection) => {
        switch (selection) {
            case 'profile':
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
        <div className="container">
            <div className="navbar">
                <label htmlFor="navDropdown" className="dropdown-label">Navigation: </label>
                <select
                    id="navDropdown"
                    onChange={(e) => handleDropdownSelection(e.target.value)}
                    className="dropdown"
                >
                    <option value="">Select</option>
                    <option value="profile">Profile</option>
                    <option value="home">Home</option>
                    <option value="logout">Logout</option>
                </select>
            </div>

            <h2>Welcome to the Dashboard</h2>
            <p>Select an option below to proceed.</p>

            <div className="button-container">
                <button
                    className="button"
                    onClick={() => navigate('/available-ambulance')} // Navigate to Available Ambulance page
                >
                    Available Ambulance
                </button>
                <button
                    className="button"
                    onClick={() => navigate('/hotspots')} // Navigate to Hotspots page
                >
                    Hotspots
                </button>
                <button
                    className="button"
                    onClick={() => navigate('/report-accident')} // Navigate to Assign Ambulance page
                >
                    Report Accident
                </button>
                
                <button
                    className="button"
                    onClick={() => navigate('/logs')} // Navigate to Logs page
                >
                    Check Reports
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
