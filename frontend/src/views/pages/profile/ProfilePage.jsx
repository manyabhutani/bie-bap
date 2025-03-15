import React from 'react';
import { Container, Typography } from '@mui/material';
import AuthModel from '../../../models/authModel';
import VolunteerProfilePage from './VolunteerProfilePage';
import OrganizerProfilePage from './OrganizerProfilePage';

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
        <Container>
            {role === 'organiser' ? <OrganizerProfilePage /> : <VolunteerProfilePage />}
        </Container>
    );
};

export default ProfilePage;
