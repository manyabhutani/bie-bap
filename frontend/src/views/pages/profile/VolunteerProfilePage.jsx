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
    IconButton
} from '@mui/material';
import {
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    EventNote as EventIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    Edit as EditIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import API from '../../../services/api';
import { Link } from 'react-router-dom';

const VolunteerProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const theme = useTheme();

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await API.get('/volunteers/me');
            setProfile(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error fetching volunteer profile');
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
            const res = await API.put('/volunteers/me', profile);
            setProfile(res.data);
            setEditMode(false);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { text: 'My Profile', icon: <PersonIcon />, path: '/profile' },
        { text: 'My Events', icon: <EventIcon />, path: '/events' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Volunteer Portal
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
                            {profile.first_name ? profile.first_name.charAt(0) : 'V'}
                        </Avatar>
                        <Typography variant="h6">
                            {profile.first_name ? `${profile.first_name} ${profile.last_name}` : 'Volunteer'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {profile.email || ''}
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
                                selected={item.path === '/profile'}
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
                                    My Profile
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
                                        label="Whatsapp number"
                                        name="phone"
                                        fullWidth
                                        value={profile.whatsapp_number || ''}
                                        disabled={true}
                                        variant="filled"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        fullWidth
                                        value={profile.email || ''}
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
                                        label="Bio"
                                        name="bio"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={profile.bio || ''}
                                        onChange={handleChange}
                                        disabled={loading || !editMode}
                                        variant={editMode ? "outlined" : "filled"}
                                        InputProps={{
                                            readOnly: !editMode,
                                        }}
                                    />
                                </Grid>
                            </Grid>

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

export default VolunteerProfilePage;