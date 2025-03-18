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
const BG_IMAGE_URL = `${process.env.PUBLIC_URL}/bg2.jpg`;

const OrganizerProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const theme = useTheme();

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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
                     url(${BG_IMAGE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                py: 8,
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 2,
                    p: 4,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 4 }}>
                        Organizer Profile
                    </Typography>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Container>
        </Box>

    );
};

export default OrganizerProfilePage;