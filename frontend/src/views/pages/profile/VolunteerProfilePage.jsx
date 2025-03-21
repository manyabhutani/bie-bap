import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    ListItem,
    List,
    CircularProgress,
    Paper,
    Avatar,
} from '@mui/material';
import API from '../../../services/api';

const BG_IMAGE_URL = `${process.env.PUBLIC_URL}/bg2.jpg`;

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

    const nationalityOptions = ['USA', 'Canada', 'India', 'Germany', 'Brazil'];

    const languageOptions = ['English', 'Spanish', 'French', 'German', 'Hindi'];

    const handleLanguageChange = (event) => {
        const {
            target: { value },
        } = event;
        setProfile({
            ...profile,
            language: typeof value === 'string' ? value.split(',') : value,
        });
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
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 4,
                    p: 4,
                    boxShadow: 3,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
                        Volunteer Profile
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

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
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            fullWidth
                            margin="normal"
                            value={profile.last_name || ''}
                            onChange={handleChange}
                            disabled={loading}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            fullWidth
                            margin="normal"
                            value={profile.phone || ''}
                            onChange={handleChange}
                            disabled={loading}
                            variant="outlined"
                            sx={{ mb: 2 }}
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
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="normal" disabled={loading} sx={{ mb: 2 }}>
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

                        <FormControl fullWidth margin="normal" disabled={loading} sx={{ mb: 2 }}>
                            <InputLabel>Languages</InputLabel>
                            <Select
                                label="Languages"
                                name="language"
                                multiple
                                value={profile.language || []}
                                onChange={handleLanguageChange}
                                renderValue={(selected) => selected.join(', ')}
                                variant="outlined"
                            >
                                {languageOptions.map((language) => (
                                    <MenuItem key={language} value={language}>
                                        <Checkbox checked={profile.language?.includes(language)} />
                                        <ListItemText primary={language} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'UPDATE PROFILE'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default VolunteerProfilePage;