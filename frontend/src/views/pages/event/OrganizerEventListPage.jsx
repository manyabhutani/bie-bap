import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Button, Alert, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../../services/api';

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', start_time: '', end_time: '' , max_volunteers: '' });
    const navigate = useNavigate();
    const [editingEvent, setEditingEvent] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);


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


    const handleCreateEvent = async () => {
        try {
            const formattedEventData = {
                ...newEvent,
                start_time: new Date(newEvent.start_time).toISOString(),
                end_time: new Date(newEvent.end_time).toISOString(),
            };

            const res = await API.post('/events', formattedEventData);
            alert('Event created successfully!');
            setOpenDialog(false);
            fetchEvents();
        } catch (err) {
            console.error("Event creation error:", err.response?.data);

            const errorDetail = err.response?.data?.detail;

            if (Array.isArray(errorDetail)) {
                setError(errorDetail.map(e => e.msg).join(', '));
            } else if (typeof errorDetail === "string") {
                setError(errorDetail);
            } else {
                setError('Error creating event. Please check your inputs.');
            }
        }
    };
    const handleUpdateEvent = async () => {
        try {
            if (!editingEvent) return;

            const updatedEventData = {
                ...editingEvent,
                start_time: new Date(editingEvent.start_time).toISOString(),
                end_time: new Date(editingEvent.end_time).toISOString(),
            };

            await API.put(`/events/${editingEvent.id}/`, updatedEventData);

            alert('Event updated successfully!');
            setOpenEditDialog(false);
            fetchEvents();
        } catch (err) {
            console.error('Event update error:', err.response?.data);
            setError('Error updating event. Please check your inputs.');
        }
    };



    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Events
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mb: 3 }}>
                Create New Event
            </Button>

            <List>
                {events.map((event) => (
                    <ListItem key={event.id} divider>
                        <ListItemText
                            primary={event.title}
                            secondary={event.description}
                        />
                        <Button variant="outlined" color="secondary"
                            onClick={() => {
                                setEditingEvent(event);
                                setOpenEditDialog(true);
                            }}
                        >
                            Edit
                        </Button>

                    </ListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create a New Event</DialogTitle>
                <DialogContent>
                    <TextField
                        name="title"
                        label="Title"
                        fullWidth
                        value={newEvent.title}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        value={newEvent.description}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={newEvent.location}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="start_time"
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        value={newEvent.start_time}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="end_time"
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        value={newEvent.end_time}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        name="max_volunteers"
                        label="Max_Volunteers"
                        fullWidth
                        value={newEvent.max_volunteers}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleCreateEvent(newEvent)} color="primary">
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField
                        name="title"
                        label="Title"
                        fullWidth
                        value={editingEvent?.title || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        value={editingEvent?.description || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={editingEvent?.location || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="start_time"
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        value={editingEvent?.start_time?.slice(0, 16) || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="end_time"
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        value={editingEvent?.end_time?.slice(0, 16) || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="max_volunteers"
                        label="Max Volunteers"
                        fullWidth
                        value={editingEvent?.max_volunteers || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, max_volunteers: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpdateEvent()} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default EventListPage;
