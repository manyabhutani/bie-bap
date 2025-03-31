import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    TextField,
    Button,
    Alert,
    Typography,
    Container,
    LinearProgress,
    IconButton
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import API from '../../../services/api';

const BG_IMAGE_URL = `${process.env.PUBLIC_URL}/bg2.jpg`;

const OrganizerProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

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

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {loading && <LinearProgress sx={{ width: '100%', mb: 2 }} />}

                    <Avatar sx={{ width: 80, height: 80, mb: 2 }} />

                    <Card sx={{ width: '100%' }}>
                        <CardContent>
                            <TextField
                                label="Organization Name"
                                name="organization_name"
                                value={profile.organization_name || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                            />
                            <TextField
                                label="Phone"
                                name="phone"
                                value={profile.phone || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={profile.description || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                            />
                            <TextField
                                label="address"
                                name="address"
                                value={profile.address || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                {editMode ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleUpdate}
                                    >
                                        Save
                                    </Button>
                                ) : (
                                    <IconButton color="primary" onClick={() => setEditMode(true)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default OrganizerProfilePage;
