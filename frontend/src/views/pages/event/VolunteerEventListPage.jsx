import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import API from '../../../services/api';

const VolunteerEventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAssignedEvents();
    }, []);

    const fetchAssignedEvents = async () => {
        try {
            const res = await API.get('/volunteers/me/events');
            setEvents(res.data);
        } catch (err) {
            setError('Error fetching assigned events');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4">My Assigned Events</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <List>
                {events.map((event) => (
                    <ListItem key={event.id} divider>
                        <ListItemText primary={event.title} secondary={event.description} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default VolunteerEventListPage;
