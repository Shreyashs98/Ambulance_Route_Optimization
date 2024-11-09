import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './services/api';

const LoginPage = () => {
    const [hospitalId, setHospitalId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!hospitalId || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        const credentials = { hospitalId, password };

        try {
            const result = await loginUser(credentials);
            console.log('Login successful:', result);
            navigate('/welcome');
        } catch (error) {
            console.log(error);
            setError('Invalid Hospital ID or Password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Hospital ID:</label>
                        <input
                            type="text"
                            value={hospitalId}
                            onChange={(e) => setHospitalId(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p style={styles.registerText}>
                        Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
        fontFamily: 'Arial, sans-serif',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.5em',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        fontSize: '0.9em',
        color: '#555',
        marginBottom: '8px',
        display: 'block',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '1em',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4e54c8',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#3a41a3',
    },
    error: {
        color: 'red',
        marginTop: '10px',
        fontSize: '0.9em',
    },
    loginText: {
        marginTop: '20px',
        fontSize: '0.9em',
        color: '#555',
    },
    link: {
        color: '#4e54c8',
        textDecoration: 'none',
    },
};

export default LoginPage;
