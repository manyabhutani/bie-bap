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

    return (
        <Box sx={{ display: 'flex' }}>

        </Box>
    );
};

export default OrganizerProfilePage;