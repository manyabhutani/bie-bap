import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VolunteerEventListPage from '../event/VolunteerEventListPage';
import OrganizerEventListPage from '../event/OrganizerEventListPage';
import AuthModel from "../../../models/authModel";
import NavBar from "../../../components/NavBar";
import {Container} from "@mui/material";
import OrganizerProfilePage from "../profile/OrganizerProfilePage";
import VolunteerProfilePage from "../profile/VolunteerProfilePage";

const EventPage = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const userRole = AuthModel.getRole();
        if (userRole) {
            setRole(userRole);
        }
    }, []);

    if (role === null) {
        return null;
    }
    return (
        <>
            <NavBar />
            <Container sx={{ mt: 4 }}>
                { role === 'organizer' ? <OrganizerEventListPage /> : <VolunteerEventListPage />}
            </Container>
        </>
    );
};

export default EventPage;
