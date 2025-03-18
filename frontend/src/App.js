// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/pages/auth/LoginPage';
import SignupPage from './views/pages/auth/SignupPage';
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./views/pages/profile/ProfilePage";
import EventPage from "./views/pages/event/EventPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <PrivateRoute>
                            <EventPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
