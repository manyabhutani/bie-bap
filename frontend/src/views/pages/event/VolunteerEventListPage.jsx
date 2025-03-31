import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Grid,
    Avatar,
    Alert,
    Divider
} from '@mui/material';
import { EventNote, Schedule, LocationOn } from '@mui/icons-material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import API from '../../../services/api';
import { format, parseISO } from "date-fns";

const localizer = momentLocalizer(moment);

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
            console.log("API Response:", res.data);

            const transformedEvents = res.data.map(event => {
                console.log("Processing event:", event.start_time);
                return {
                    ...event,
                    start: new Date(event.start_time),
                    end: new Date(event.end_time),
                    title: event.title
                };
            });

            setEvents(transformedEvents);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError('Error fetching assigned events. Please try again later.');
        }
    };

    const handleEventClick = (event) => {
        console.log("Clicked Event:", event);
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            // Try to parse as ISO date
            const date = new Date(dateTimeString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateTimeString);
                return 'Invalid date';
            }
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Date formatting error:", e, "for date:", dateTimeString);
            return 'Error formatting date';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, py: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                My Assigned Events
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {/* Event List Column */}
                <Grid item xs={12} md={7}>
                    {events.length > 0 ? events.map((event) => (
                        <Paper
                            key={event.id || `event-${Math.random()}`}
                            elevation={3}
                            sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: 2,
                                '&:hover': { boxShadow: 4 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                    <EventNote />
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {event.title || 'Untitled Event'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.description || 'No description provided.'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                        <Schedule fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                                        </Typography>
                                    </Box>

                                    {event.location && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                            <LocationOn fontSize="small" color="action" />
                                            <Typography variant="body2">{event.location}</Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleEventClick(event)}
                                >
                                    Details
                                </Button>
                            </Box>
                        </Paper>
                    )) : (
                        <Typography>No assigned events.</Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Event Calendar
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                titleAccessor="title"
                                defaultView="month"
                                views={['month']}
                                onSelectEvent={handleEventClick}
                                style={{ height: 400 }}
                                eventPropGetter={(event) => ({
                                    style: {
                                        backgroundColor: '#3f51b5',
                                        borderRadius: '4px',
                                        color: 'white'
                                    }
                                })}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                {selectedEvent ? (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>
                            {selectedEvent.title || 'Event Details'}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ py: 1 }}>
                                <Typography paragraph>
                                    <strong>Description:</strong> {selectedEvent.description || 'No description available'}
                                </Typography>
                                <Divider sx={{ my: 1 }} />

                                {/* Time display */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Schedule color="primary" />
                                    <Typography>
                                        <strong>Time:</strong> {formatDateTime(selectedEvent.start_time)} - {formatDateTime(selectedEvent.end_time)}
                                    </Typography>
                                </Box>

                                {/* Location display */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOn color="primary" />
                                    <Typography>
                                        <strong>Location:</strong> {selectedEvent.location || 'No location specified'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" color="text.secondary">Debug Data:</Typography>
                                <Box sx={{
                                    mt: 1,
                                    p: 1,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontFamily: 'monospace',
                                    overflowX: 'auto'
                                }}>
                                    <pre>{JSON.stringify(selectedEvent, null, 2)}</pre>
                                </Box>

                                {selectedEvent.volunteers && selectedEvent.volunteers.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                                            Other Volunteers:
                                        </Typography>
                                        {selectedEvent.volunteers.map(volunteer => (
                                            <Typography key={volunteer.id || Math.random()} variant="body2">
                                                {volunteer.first_name} {volunteer.last_name}
                                                {volunteer.nationality ? ` (${volunteer.nationality})` : ''}
                                            </Typography>
                                        ))}
                                    </>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} variant="contained">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    <DialogContent>
                        <Typography>No Event Selected</Typography>
                    </DialogContent>
                )}
            </Dialog>
        </Container>
    );
};

export default VolunteerEventListPage;