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
    Paper,
    IconButton,
    Divider
} from '@mui/material';
import API from '../../../services/api';
import {
    EventNote as EventIcon,
    People as VolunteerIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as ProfileIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

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

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            const date = parseISO(dateTimeString);
            return format(date, 'MMM d, yyyy h:mm a');
        } catch (e) {
            return dateTimeString;
        }
    };

    const formatDateForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            const date = parseISO(dateTimeString);
            return format(date, "yyyy-MM-dd'T'HH:mm");
        } catch (e) {
            return '';
        }
    };

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
            console.log("Fetched Events:", res.data);
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
            setNewEvent({ title: '', description: '', location: '', start_time: '', end_time: '', max_volunteers: '' });
            fetchEvents();
        } catch (err) {
            console.error('Create error:', err);
            setError('Error creating event. Please check inputs.');
        }
    };

    const handleUpdateEvent = async () => {
        try {
            if (!editingEvent) return;

            const updatedEventData = {
                ...editingEvent,
                start_time: editingEvent.start_time.includes('T')
                    ? editingEvent.start_time
                    : new Date(editingEvent.start_time).toISOString(),
                end_time: editingEvent.end_time.includes('T')
                    ? editingEvent.end_time
                    : new Date(editingEvent.end_time).toISOString(),
            };

            await API.put(`/events/${editingEvent.id}/`, updatedEventData);

            alert('Event updated successfully!');
            setOpenEditDialog(false);
            fetchEvents();
        } catch (err) {
            console.error('Update error:', err);
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

    const handleOpenAssignDialog = (event) => {
        setSelectedEventId(event.id);
        const assignedIds = event.volunteers?.map(v => v.id) || [];
        setSelectedVolunteers(assignedIds);
        setOpenAssignDialog(true);
    };

    const filteredVolunteers = volunteers.filter((volunteer) =>
        `${volunteer.first_name} ${volunteer.last_name}`.toLowerCase().includes(searchQuery)
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, p: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
                Event Management
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 3 }}
                onClick={() => setOpenDialog(true)}
                startIcon={<EventIcon />}
            >
                Create New Event
            </Button>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {events.map((event) => (
                    <Paper key={event.id} elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {event.description}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                    <ScheduleIcon fontSize="small" color="action" />
                                    <Typography variant="body2">
                                        {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                                    </Typography>
                                </Box>

                                {event.location && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                                        <LocationIcon fontSize="small" color="action" />
                                        <Typography variant="body2">{event.location}</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        const eventWithFormattedDates = {
                                            ...event,
                                            start_time: formatDateForInput(event.start_time),
                                            end_time: formatDateForInput(event.end_time)
                                        };
                                        setEditingEvent(eventWithFormattedDates);
                                        setOpenEditDialog(true);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>

                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>

                                <IconButton
                                    color="secondary"
                                    onClick={() => handleOpenAssignDialog(event)}
                                >
                                    <VolunteerIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {event.volunteers?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Divider sx={{ mb: 1 }} />
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
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                ))}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create a New Event</DialogTitle>
                <DialogContent>
                    <TextField
                        name="title"
                        label="Title"
                        fullWidth
                        value={newEvent.title}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        value={newEvent.description}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                    <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={newEvent.location}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        margin="dense"
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
                        margin="dense"
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
                        margin="dense"
                    />
                    <TextField
                        name="max_volunteers"
                        label="Max Volunteers"
                        fullWidth
                        value={newEvent.max_volunteers}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateEvent} variant="contained">Create Event</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField
                        name="title"
                        label="Title"
                        fullWidth
                        value={editingEvent?.title || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        value={editingEvent?.description || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                    <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={editingEvent?.location || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                    <TextField
                        name="start_time"
                        label="Start Time"
                        fullWidth
                        value={editingEvent?.start_time || ''}
                        type="datetime-local"
                        onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                    />
                    <TextField
                        name="end_time"
                        label="End Time"
                        fullWidth
                        value={editingEvent?.end_time || ''}
                        type="datetime-local"
                        onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                    />
                    <TextField
                        name="max_volunteers"
                        label="Max Volunteers"
                        fullWidth
                        value={editingEvent?.max_volunteers || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, max_volunteers: e.target.value })}
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateEvent} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAssignDialog}
                onClose={() => setOpenAssignDialog(false)}
                maxWidth="sm"
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
                        sx={{ mb: 2 }}
                        margin="dense"
                    />
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
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
                                <ListItemText
                                    primary={`${volunteer.first_name} ${volunteer.last_name}`}
                                    secondary={volunteer.email}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleViewProfile(volunteer)}
                                >
                                    Profile
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
                    <Button onClick={handleAssignVolunteers} variant="contained">Assign</Button>
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
                            <Typography variant="body1"><strong>Nationality:</strong> {selectedVolunteerProfile.nationality}</Typography>
                            <Typography variant="body1"><strong>Languages:</strong> {selectedVolunteerProfile.languages?.join(', ')}</Typography>
                            <Typography variant="body1"><strong>About:</strong> {selectedVolunteerProfile.bio}</Typography>
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