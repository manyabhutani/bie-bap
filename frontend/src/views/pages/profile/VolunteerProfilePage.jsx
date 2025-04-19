import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    CircularProgress,
    Avatar,
    Grid,
} from '@mui/material';
import API from '../../../services/api';

const BG_IMAGE_URL = `${process.env.PUBLIC_URL}/bg2.jpg`;

const VolunteerProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await API.delete('/volunteers/me');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');

            window.location.href = '/signup';
        } catch (err) {
            setError(err.response?.data?.detail || 'Error deleting profile');
        } finally {
            setLoading(false);
        }
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

    const nationalityOptions = [
        'Argentina', 'Australia', 'Bangladesh', 'Brazil','Canada', 'China', 'Czech Republic', 'Egypt', 'France',
        'Germany', 'Hungary', 'India', 'Indonesia', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Russia', 'Slovakia',
        'South Africa', 'South Korea', 'Spain', 'Sweden', 'Turkey', 'Ukraine', 'United Kingdom', 'USA'
    ];
    const languageOptions = [
        'Arabic', 'Czech', 'Dutch', 'English', 'French', 'German', 'Hindi', 'Hungarian', 'Italian', 'Japanese', 'Korean', 'Mandarin', 'Persian',
        'Polish', 'Portuguese', 'Romanian', 'Russian', 'Slovak', 'Spanish', 'Swedish', 'Turkish', 'Ukrainian', 'Vietnamese'
    ];


    const handleLanguageChange = (event) => {
        const {
            target: { value },
        } = event;
        setProfile({
            ...profile,
            languages: typeof value === 'string' ? value.split(',') : value,
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `url(${BG_IMAGE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(19,2,2,0.4)',
                    zIndex: 1,
                }}
            />

            <Container
                maxWidth="md"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 4,
                    p: 4,
                    boxShadow: 3,
                    zIndex: 2,
                    position: 'relative',
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            {/* Avatar */}
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    mb: 2,
                                    bgcolor: 'primary.main',
                                    fontSize: '2.5rem',
                                }}
                            >
                                {profile.first_name?.charAt(0) || 'V'}
                            </Avatar>

                            {/* Title */}
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                                Volunteer Profile
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box
                            component="form"
                            onSubmit={handleUpdate}
                            noValidate
                            sx={{ width: '100%' }}
                        >
                            {/* Error Alert */}
                            {error && (
                                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="First Name"
                                        name="first_name"
                                        fullWidth
                                        margin="normal"
                                        value={profile.first_name || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Last Name"
                                        name="last_name"
                                        fullWidth
                                        margin="normal"
                                        value={profile.last_name || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        fullWidth
                                        margin="normal"
                                        value={profile.phone || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth margin="normal" disabled={loading}>
                                        <InputLabel>Nationality</InputLabel>
                                        <Select
                                            label="Nationality"
                                            name="nationality"
                                            value={profile.nationality || ''}
                                            onChange={handleChange}
                                            variant="outlined"
                                        >
                                            {nationalityOptions.map((nationality) => (
                                                <MenuItem key={nationality} value={nationality}>
                                                    {nationality}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth margin="normal" disabled={loading}>
                                        <InputLabel>Languages</InputLabel>
                                        <Select
                                            label="Languages"
                                            name="language"
                                            multiple
                                            value={profile.languages || []}
                                            onChange={handleLanguageChange}
                                            renderValue={(selected) => selected.join(', ')}
                                            variant="outlined"
                                        >
                                            {languageOptions.map((language) => (
                                                <MenuItem key={language} value={language}>
                                                    <Checkbox checked={profile.languages?.includes(language)} />
                                                    <ListItemText primary={language} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
                                        disabled={loading}
                                        fullWidth
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'UPDATE PROFILE'}
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
                                        onClick={handleDeleteProfile}
                                        fullWidth
                                    >
                                        DELETE PROFILE
                                    </Button>
                                </Grid>

                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default VolunteerProfilePage;