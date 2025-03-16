import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthModel from '../models/authModel';

const NavBar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        AuthModel.logout();
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/profile" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    FS Czech Volunteer Hub
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/profile">Profile</Button>
                    <Button color="inherit" component={Link} to="/events">Events</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
