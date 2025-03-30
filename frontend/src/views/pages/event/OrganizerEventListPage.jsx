import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Alert,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Box,
    Checkbox,
    ListItemIcon,
    Avatar,
    Chip,
} from '@mui/material';
import API from '../../../services/api';
import {
    EventNote as EventIcon,
    People as VolunteerIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as ProfileIcon
} from '@mui/icons-material';

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

    const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', start_time: '', end_time: '', max_volunteers: '' });
    const [editingEvent, setEditingEvent] = useState(null);

    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedVolunteers, setSelectedVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVolunteerProfile, setSelectedVolunteerProfile] = useState(null);

    const fetchVolunteers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/volunteers');
            setVolunteers(res.data);
        } catch (err) {
            setError('Error fetching volunteers');
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await API.get('/events');
            console.log("Fetched Events:", res.data); // Log the backend response
            setEvents(res.data);
        } catch (err) {
            setError('Error fetching events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchVolunteers();
    }, []);

    const handleCreateEvent = async () => {
        try {
            const formattedEventData = {
                ...newEvent,
                start_time: new Date(newEvent.start_time).toISOString(),
                end_time: new Date(newEvent.end_time).toISOString(),
            };

            await API.post('/events', formattedEventData);
            alert('Event created successfully!');
            setOpenDialog(false);
            fetchEvents();
        } catch (err) {
            setError('Error creating event. Please check inputs.');
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
            setError('Error updating event.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await API.delete(`/events/${eventId}`);
            alert('Event deleted successfully!');
            fetchEvents();
        } catch (err) {
            setError('Error deleting event.');
        }
    };

    const handleAssignVolunteers = async () => {
        if (!selectedEventId) {
            setError("Please select an event first.");
            return;
        }

        try {
            await API.post(`/events/${selectedEventId}/assign`, { volunteer_ids: selectedVolunteers });
            alert('Volunteers assigned successfully!');
            setOpenAssignDialog(false);
            fetchEvents();
        } catch (err) {
            setError('Error assigning volunteers.');
        }
    };

    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleViewProfile = (volunteer) => {
        setSelectedVolunteerProfile(volunteer);
        setOpenProfileDialog(true);
    };

    const filteredVolunteers = volunteers.filter((volunteer) =>
        `${volunteer.first_name} ${volunteer.last_name}`.toLowerCase().includes(searchQuery)
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Event Management
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}

            <Button variant="contained" color="primary" fullWidth sx={{ mb: 3 }} onClick={() => setOpenDialog(true)}>
                Create New Event
            </Button>

            <List>
                {events.map((event) => (
                    <ListItem key={event.id} divider sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <ListItemText
                                primary={event.title}
                                secondary={
                                    <>
                                        <Typography variant="body2">
                                            {event.description}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Start:</strong> {event.start_time}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>End:</strong> {event.end_time}
                                        </Typography>
                                    </>
                                }
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" color="primary" startIcon={<EditIcon/>}
                                        onClick={() => {
                                            setEditingEvent(event);
                                            setOpenEditDialog(true);
                                        }}>
                                    Edit
                                </Button>

                                <Button variant="outlined" startIcon={<DeleteIcon/>} color="error" onClick={() => handleDeleteEvent(event.id)}>
                                    Delete
                                </Button>

                                <Button variant="contained" startIcon={<VolunteerIcon />} color="primary" onClick={() => {
                                    setSelectedEventId(event.id);
                                    setOpenAssignDialog(true);
                                }}>
                                    Assign Volunteers
                                </Button>
                            </Box>
                        </Box>

                        {event.volunteers?.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Assigned Volunteers:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {event.volunteers.map((volunteer) => (
                                        <Chip
                                            key={volunteer.id}
                                            label={`${volunteer.first_name} ${volunteer.last_name}`}
                                            onClick={() => handleViewProfile(volunteer)}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </ListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
                        label="Max Volunteers"
                        fullWidth
                        value={newEvent.max_volunteers}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateEvent}>Create Event</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField name="title" label="Title" fullWidth value={editingEvent?.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} sx={{ mb: 2 }} />
                    <TextField name="description" label="Description" fullWidth value={editingEvent?.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} sx={{ mb: 2 }} />
                    <TextField name="location" label="Location" fullWidth value={editingEvent?.location || ''} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} sx={{ mb: 2 }} />
                    <TextField name="start_time" label="Start Time" fullWidth value={editingEvent?.start_time || ''} type="datetime-local" onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                    <TextField name="end_time" label="End Time" fullWidth value={editingEvent?.end_time || ''} type="datetime-local" onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateEvent}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAssignDialog}
                onClose={() => setOpenAssignDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Assign Volunteers</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Search Volunteers"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ mb: 1}}
                    />
                    <List>
                        {filteredVolunteers.map((volunteer) => (
                            <ListItem key={volunteer.id} divider>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selectedVolunteers.includes(volunteer.id)}
                                        onChange={() => {
                                            const newSelected = selectedVolunteers.includes(volunteer.id)
                                                ? selectedVolunteers.filter((id) => id !== volunteer.id)
                                                : [...selectedVolunteers, volunteer.id];
                                            setSelectedVolunteers(newSelected);
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={`${volunteer.first_name} ${volunteer.last_name}`} />
                                <Button variant="outlined" onClick={() => handleViewProfile(volunteer)}>
                                    View Profile
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
                    <Button onClick={handleAssignVolunteers}>Assign</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Volunteer Profile</DialogTitle>
                <DialogContent>
                    {selectedVolunteerProfile && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                            >
                                {selectedVolunteerProfile.first_name?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6">{`${selectedVolunteerProfile.first_name} ${selectedVolunteerProfile.last_name}`}</Typography>
                            <Typography variant="body1"><strong>Phone:</strong> {selectedVolunteerProfile.phone}</Typography>
                            <Typography variant="body1"><strong>Email:</strong> {selectedVolunteerProfile.email}</Typography>
                            <Typography variant="body1"><strong>Nationality:</strong> {selectedVolunteerProfile.nationality}</Typography>
                            <Typography variant="body1"><strong>Languages:</strong> {selectedVolunteerProfile.languages?.join(', ')}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EventListPage;