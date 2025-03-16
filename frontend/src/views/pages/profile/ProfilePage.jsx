import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import AuthModel from '../../../models/authModel';
import VolunteerProfilePage from './VolunteerProfilePage';
import OrganizerProfilePage from './OrganizerProfilePage';
import NavBar from '../../../components/NavBar';

const ProfilePage = () => {
    const role = AuthModel.getRole();

    if (!role) {
        return (
            <Container>
                <Typography variant="h6">
                    Unable to determine user role. Please log in.
                </Typography>
            </Container>
        );
    }

    return (
        <>
            <NavBar />
            <Container sx={{ mt: 4 }}>
                {role === 'organizer' ? <OrganizerProfilePage /> : <VolunteerProfilePage />}
            </Container>
        </>
    );
};

export default ProfilePage;
