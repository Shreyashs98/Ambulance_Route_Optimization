import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from './services/api';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [location, setLocation] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !hospitalName || !hospitalId || !location || !number || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        const userData = {
            email,
            hospitalName,
            hospitalId,
            location,
            number,
            password,
        };

        try {
            await registerUser(userData);
            alert("Registration successful!");
            navigate('/');
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Register</h2>
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Hospital Name:</label>
                        <input
                            type="text"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            style={styles.input}
                        />
                    </div>
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
                        <label style={styles.label}>Location:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number:</label>
                        <input
                            type="tel"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <p style={styles.loginText}>
                        Already have an account? <Link to="/" style={styles.link}>Login here</Link>
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

export default RegisterPage;
