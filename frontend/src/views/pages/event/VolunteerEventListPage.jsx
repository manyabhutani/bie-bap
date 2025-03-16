import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../../services/api';

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await API.get('/events');
            setEvents(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error fetching events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle volunteer signup for an event
    const handleSignup = async (eventId) => {
        try {
            const res = await API.post(`/events/${eventId}/signup`);
            alert('Successfully signed up for the event!');
            fetchEvents();
        } catch (err) {
            setError(err.response?.data?.detail || 'Error signing up for event');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Available Events
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <List>
                {events.map((event) => (
                    <ListItem key={event.id} divider>
                        <ListItemText
                            primary={event.title}
                            secondary={event.description}
                        />
                        <Button variant="outlined" onClick={() => handleSignup(event.id)}>
                            Sign Up
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default EventListPage;
