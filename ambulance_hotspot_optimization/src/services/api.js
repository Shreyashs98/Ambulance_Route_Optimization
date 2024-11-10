// src/services/api.js
import axios from 'axios';

// Get the API URL from the environment variables based on the environment
const API_URL = process.env.REACT_APP_API_URL;  // Use the correct API URL based on environment


// Create an ambulance
export const createAmbulance = async (ambulanceData) => {
    try {
        const response = await axios.post(`${API_URL}/ambulance`, ambulanceData);
        return response.data;
    } catch (error) {
        console.error('Error creating ambulance:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

// Retrieve all ambulances
export const getAllAmbulances = async () => {
    try {
        const response = await axios.get(`${API_URL}/ambulance`);
        return response.data; // Adjust according to your API response structure
    } catch (error) {
        console.error('Error retrieving ambulances:', error);
        throw error;
    }
};

// Create an accident report
export const createAccident = async (accidentData) => {
    try {
        const response = await axios.post(`${API_URL}/accident`, accidentData);
        return response.data;
    } catch (error) {
        console.error('Error creating accident:', error);
        throw error;
    }
};

// Retrieve all accident reports
export const getAllAccidents = async () => {
    try {
        const response = await axios.get(`${API_URL}/accident`);
        return response.data; // Adjust according to your API response structure
    } catch (error) {
        console.error('Error retrieving accidents:', error);
        throw error;
    }
};

// Example: User registration
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Example: User login
export const loginUser = async (credentials) => {

    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error logging in:', error.response.data); // Log response data for debugging
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // Request was made but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            throw new Error('Error in login request');
        }
    }
};

// Exporting all functions for easier import in components
const api = {
    createAmbulance,
    getAllAmbulances,
    createAccident,
    getAllAccidents,
    registerUser,
    loginUser,
};

export default api;
