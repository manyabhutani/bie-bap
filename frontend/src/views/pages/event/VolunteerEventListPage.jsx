import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, Button, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import API from '../../../services/api';

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleSignup = async (eventId) => {
        try {
            await API.post(`/events/${eventId}/signup`);
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
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {events.map((event) => (
                <Accordion key={event.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{event.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1">{event.description}</Typography>
                        <Typography variant="body2">Location: {event.location || "N/A"}</Typography>
                        <Typography variant="body2">Start: {new Date(event.start_time).toLocaleString()}</Typography>
                        <Typography variant="body2">End: {new Date(event.end_time).toLocaleString()}</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleSignup(event.id)} sx={{ mt: 1 }}>
                            Sign Up
                        </Button>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
};

export default EventListPage;
