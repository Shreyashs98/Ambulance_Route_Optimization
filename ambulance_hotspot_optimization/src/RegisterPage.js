import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from './services/api'; // Import the registerUser function

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [location, setLocation] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword]= useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true); // Set loading to true

        // Basic validation
        if (!email || !hospitalName || !hospitalId || !location || !number || !password) {
            setError('Please fill in all fields.');
            setLoading(false); // Reset loading state
            return;
        }

        // Prepare user data for registration
        const userData = {
            email,
            hospitalName,
            hospitalId,
            location,
            number,
            password
        };

        try {
            // Call the API to register the user
            await registerUser(userData);
            alert("Registration successful!");
            navigate('/'); // Redirect to login page or a welcome page
        } catch (error) {
            setError('Registration failed. Please try again.'); // Handle API errors
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Hospital Name:</label>
                    <input
                        type="text"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Hospital ID:</label>
                    <input
                        type="text"
                        value={hospitalId}
                        onChange={(e) => setHospitalId(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Password:</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p>
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </form>
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
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '350px',
    },
    inputGroup: {
        width: '100%',
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default RegisterPage;
