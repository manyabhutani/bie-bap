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

const localizer = momentLocalizer(moment);

const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };
    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    return (
        <div className="rbc-toolbar">
            <div className="rbc-btn-group">
                <Button variant="outlined" onClick={goToCurrent}>Today</Button>
                <Button variant="outlined" onClick={goToBack}>Back</Button>
                <Button variant="outlined" onClick={goToNext}>Next</Button>
            </div>
            <div className="rbc-toolbar-label">{toolbar.label}</div>
            <div className="rbc-btn-group">
                {toolbar.views.map(view => (
                    <Button
                        key={view}
                        variant={toolbar.view === view ? "contained" : "outlined"}
                        onClick={() => toolbar.onView(view)}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                ))}
            </div>
        </div>
    );
};

const VolunteerEventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentView, setCurrentView] = useState('week');
    useEffect(() => {
        fetchAssignedEvents();
    }, []);

    const fetchAssignedEvents = async () => {
        try {
            const res = await API.get('/volunteers/me/events');
            console.log("API Response:", res.data);

            // Validate and transform events data
            const transformedEvents = res.data.map(event => {
                // Ensure dates are valid
                const startDate = new Date(event.start_time);
                const endDate = new Date(event.end_time);

                // Validate dates
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.error("Invalid date for event:", event);
                    return null;
                }

                return {
                    ...event,
                    start: startDate,
                    end: endDate,
                    title: event.title || 'Untitled Event',
                    resource: event.id
                };
            }).filter(event => event !== null);

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

    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: '#3f51b5',
                borderRadius: '4px',
                color: 'white',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer'
            }
        };
    };


    const handleViewChange = (newView) => {
        console.log("View changed to:", newView);
        setCurrentView(newView);
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
                                '&:hover': { boxShadow: 4, cursor: 'pointer' }
                            }}
                            onClick={() => handleEventClick(event)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                    <EventNote />
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {event.title}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEventClick(event);
                                    }}
                                >
                                    Details
                                </Button>
                            </Box>
                        </Paper>
                    )) : (
                        <Typography>No assigned events.</Typography>
                    )}
                </Grid>

                {/* Calendar Column */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Event Calendar
                        </Typography>
                        <Box
                            sx={{
                                height: 500,
                                '& .rbc-calendar': {
                                    borderRadius: 1,
                                    border: '1px solid rgba(0, 0, 0, 0.12)'
                                }
                            }}
                        >
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                titleAccessor="title"
                                view={currentView}
                                onView={handleViewChange}
                                defaultView="week"
                                views={['month', 'week', 'day', 'agenda']}
                                onSelectEvent={handleEventClick}
                                style={{ height: 500 }}
                                eventPropGetter={eventStyleGetter}
                                components={{
                                    toolbar: CustomToolbar
                                }}
                                onNavigate={(date, view) => console.log("Navigated to:", date, view)}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Event Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedEvent ? (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>
                            {selectedEvent.title}
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