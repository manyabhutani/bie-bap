import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import API from '../../../services/api';

const VolunteerEventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchAssignedEvents();
    }, []);

    const fetchAssignedEvents = async () => {
        try {
            const res = await API.get('/volunteers/me/events');
            // Format dates for display
            const formattedEvents = res.data.map(event => ({
                ...event,
                start_time: new Date(event.start_time).toLocaleString(),
                end_time: new Date(event.end_time).toLocaleString(),
            }));
            setEvents(formattedEvents);
        } catch (err) {
            setError('Error fetching assigned events');
        }
    };

    const calendarEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        description: event.description,
        location: event.location,
    }));

    const handleEventClick = (info) => {
        const event = events.find((e) => e.id === info.event.id);
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEvent(null);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Assigned Events
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}

            {/*/!* Calendar View *!/*/}
            {/*<Box sx={{ mb: 4 }}>*/}
            {/*    <FullCalendar*/}
            {/*        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}*/}
            {/*        initialView="dayGridMonth"*/}
            {/*        events={calendarEvents}*/}
            {/*        eventClick={handleEventClick}*/}
            {/*        headerToolbar={{*/}
            {/*            left: 'prev,next today',*/}
            {/*            center: 'title',*/}
            {/*            right: 'dayGridMonth,timeGridWeek,timeGridDay',*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</Box>*/}

            {/* List View */}
            <Typography variant="h5" gutterBottom>
                Event List
            </Typography>
            <List>
                {events.map((event) => (
                    <ListItem key={event.id} divider>
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
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSelectedEvent(event);
                                setOpenDialog(true);
                            }}
                        >
                            View Details
                        </Button>
                    </ListItem>
                ))}
            </List>

            {/* Event Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                <DialogContent>
                    {selectedEvent && (
                        <>
                            <Typography variant="body1">
                                <strong>Description:</strong> {selectedEvent.description}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Location:</strong> {selectedEvent.location}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Start Time:</strong> {selectedEvent.start_time}
                            </Typography>
                            <Typography variant="body1">
                                <strong>End Time:</strong> {selectedEvent.end_time}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VolunteerEventListPage;