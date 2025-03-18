import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthModel from '../../../models/authModel';

const BG_IMAGE_URL = '/fscz.jpg';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        whatsapp_number: '',
        role: 'volunteer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await AuthModel.signup(formData);
            navigate('/'); // Redirect to login
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${BG_IMAGE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'rgba(19,2,2,0.4)',
                backgroundBlendMode: 'darken',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4 , backgroundColor : '#cecccc' }}>
                    <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
                        Sign Up
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSignup} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            name="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="WhatsApp Number"
                            name="whatsapp_number"
                            value={formData.whatsapp_number}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Role (volunteer or organizer)"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                        <Button variant="text" onClick={() => navigate('/')} disabled={loading}>
                            Already have an account? Login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignupPage;
