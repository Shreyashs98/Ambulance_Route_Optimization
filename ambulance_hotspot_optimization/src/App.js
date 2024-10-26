import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage'; // Import your LoginPage component
import RegisterPage from './RegisterPage'; // Import your RegisterPage component
import WelcomePage from './WelcomePage'; // Import your WelcomePage component
import AddAmbulancePage from './AddAmbulancePage';
import AssignAmbulance from './AssignAmbulance'; // Import your AssignAmbulance component
import AssignAmbulancePage from './AssignAmbulancePage'; // Import your AssignAmbulance component
import LogsPage from './LogsPage'; // Import your LogsPage component
import AccidentLogPage from './AccidentLogPage'; // Import your AccidentLogPage component
import CreateAccident from './components/CreateAccident';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/add-ambulance" element={<AddAmbulancePage />} />
                <Route path="/available-ambulance" element={<AssignAmbulancePage />} />
                <Route path="/assign-ambulance" element={<AssignAmbulance />} />
                <Route path="/report-accident" element={<CreateAccident />} />
                <Route path="/logs" element={<LogsPage />} />
                <Route path="/accident-log" element={<AccidentLogPage />} />
                {/* Add other routes as necessary */}
            </Routes>
        </Router>
    );
};

export default App;
