import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    TextField,
    Button,
    Alert,
    Grid,
    Typography,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Divider,
    LinearProgress,
    useTheme,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import {
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    EventNote as EventIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import API from '../../../services/api';
import { Link } from 'react-router-dom';

const OrganizerProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const theme = useTheme();

    // Fetch organizer profile from the backend
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await API.get('/organizers/me');
            setProfile(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error fetching organizer profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await API.put('/organizers/me', profile);
            setProfile(res.data);
            setEditMode(false);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const menuItems = [
        { text: 'My Profile', icon: <PersonIcon />, path: '/organizer/profile' },
        { text: 'Manage Events', icon: <EventIcon />, path: '/organizer/events' },
        { text: 'Manage Volunteers', icon: <PeopleIcon />, path: '/organizer/volunteers' },
    ];

    // Render tabs for different sections of the profile
    const renderTabContent = () => {
        switch (tabValue) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                name="first_name"
                                fullWidth
                                value={profile.first_name || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                name="last_name"
                                fullWidth
                                value={profile.last_name || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                fullWidth
                                value={profile.email || ''}
                                disabled={true}
                                variant="filled"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                name="phone"
                                fullWidth
                                value={profile.phone || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Role"
                                name="role"
                                fullWidth
                                value={profile.role || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Organization Name"
                                name="organization_name"
                                fullWidth
                                value={profile.organization_name || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Organization Description"
                                name="organization_description"
                                fullWidth
                                multiline
                                rows={4}
                                value={profile.organization_description || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Organization Website"
                                name="organization_website"
                                fullWidth
                                value={profile.organization_website || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Organization Address"
                                name="organization_address"
                                fullWidth
                                value={profile.organization_address || ''}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 2: // Preferences
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Notification Preferences"
                                name="notification_preferences"
                                fullWidth
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                value={profile.notification_preferences || 'email'}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                                <option value="both">Both</option>
                                <option value="none">None</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Default Event Privacy"
                                name="default_event_privacy"
                                fullWidth
                                select
                                SelectProps={{
                                    native: true,
                                }}
                                value={profile.default_event_privacy || 'public'}
                                onChange={handleChange}
                                disabled={loading || !editMode}
                                variant={editMode ? "outlined" : "filled"}
                                InputProps={{
                                    readOnly: !editMode,
                                }}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="invitation">Invitation Only</option>
                            </TextField>
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Organizer Portal
                    </Typography>
                </Toolbar>
                {loading && <LinearProgress />}
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Avatar
                            src={profile.avatar_url}
                            sx={{ width: 80, height: 80, mb: 1, bgcolor: theme.palette.primary.main }}
                        >
                            {profile.first_name ? profile.first_name.charAt(0) : 'O'}
                        </Avatar>
                        <Typography variant="h6">
                            {profile.first_name ? `${profile.first_name} ${profile.last_name}` : 'Organizer'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {profile.organization_name || ''}
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                selected={item.path === '/organizer/profile'}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem button component={Link} to="/logout">
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="lg">
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" component="h2">
                                    Organizer Profile
                                </Typography>
                                <IconButton
                                    color="primary"
                                    onClick={() => {
                                        if (editMode) {
                                            handleUpdate();
                                        } else {
                                            setEditMode(true);
                                        }
                                    }}
                                >
                                    {editMode ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                                    <Tab label="Personal Information" />
                                    <Tab label="Organization Information" />
                                    <Tab label="Preferences" />
                                </Tabs>
                            </Box>

                            {renderTabContent()}

                            {editMode && (
                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdate}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
};

export default OrganizerProfilePage;