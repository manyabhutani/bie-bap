import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Collapse,
    Divider
} from '@mui/material';
import API from '../../../services/api';

const BG_IMAGE_URL = `${process.env.PUBLIC_URL}/bg2.jpg`;

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeNn2IZwZ7LqCDFoRRWGi4QK9PKEbuRgmn4ilDw3PpSZXlWcA/viewform?embedded=true";

const VolunteerProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await API.get('/volunteers/me');
            setProfile(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error fetching profile');
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.put('/volunteers/me', profile);
            setProfile(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setShowForm((prev) => !prev);
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
                        Volunteer Profile
                    </Typography>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Profile Form */}
                    <Box
                        component="form"
                        onSubmit={handleUpdate}
                        noValidate
                        sx={{ width: '100%', maxWidth: 500 }}
                    >
                        <TextField
                            label="First Name"
                            name="first_name"
                            fullWidth
                            margin="normal"
                            value={profile.first_name || ''}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            fullWidth
                            margin="normal"
                            value={profile.last_name || ''}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            fullWidth
                            margin="normal"
                            value={profile.phone || ''}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Bio"
                            name="bio"
                            fullWidth
                            multiline
                            rows={3}
                            margin="normal"
                            value={profile.bio || ''}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'UPDATING PROFILE...' : 'UPDATE PROFILE'}
                        </Button>
                    </Box>

                    {/* Divider and Google Form Toggle */}
                    <Divider sx={{ width: '100%', my: 4 }} />
                    <Button variant="outlined" onClick={toggleForm} sx={{ mb: 2 }}>
                        {showForm ? 'Hide Additional Form' : 'Fill Additional Info'}
                    </Button>

                    <Collapse in={showForm} sx={{ width: '100%', maxWidth: 600 }}>
                        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden' }}>
                            <Typography variant="h6" sx={{ p: 2, bgcolor: 'grey.100' }}>
                                Additional Volunteer Info
                            </Typography>
                            <iframe
                                title="Google Form for Additional Info"
                                src={GOOGLE_FORM_URL}
                                width="100%"
                                height="800"
                                style={{ border: 'none' }}
                            >
                                Loading...
                            </iframe>
                        </Box>
                    </Collapse>
                </Box>
            </Container>
        </Box>
    );
};

export default VolunteerProfilePage;
