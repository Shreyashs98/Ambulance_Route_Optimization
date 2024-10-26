import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './services/api';

const LoginPage = () => {
    const [hospitalId, setHospitalId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Set loading to true when login starts

        // Basic validation
        if (!hospitalId || !password) {
            setError('Please fill in all fields.');
            setLoading(false); // Reset loading state if validation fails
            return;
        }

        const credentials = { hospitalId, password };

        try {
            const result = await loginUser(credentials);
            console.log('Login successful:', result);
            navigate('/welcome'); // Navigate to Welcome page on successful login
        } catch (error) {
            console.log(error)
            setError('Invalid Hospital ID or Password');
        } finally {
            setLoading(false); // Reset loading state after API call completes
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={styles.form}>
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
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'} {/* Change button text based on loading state */}
                </button>
                <p>
                    Don't have an account? <Link to="/register">Register here</Link>
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
        width: '300px',
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

export default LoginPage;
