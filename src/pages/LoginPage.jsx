import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/authService';

function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setErrorMessage('Enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            await login({ email: trimmedEmail, password });
            const currentUser = await refreshUser();

            if (!currentUser) {
                setErrorMessage('Login succeeded, but your account could not be loaded.');
                return;
            }

            navigate('/', { replace: true });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to log in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <Stack spacing={{ sm: 4, xs: 3 }}>
                <Box>
                    <Typography component="h1" variant="h1">
                        Log in to RecipeLab
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 520 }} variant="body1">
                        Continue experimenting with your recipes.
                    </Typography>
                </Box>

                {location.state?.registrationSucceeded && (
                    <Alert severity="success">Registration successful. You can now log in.</Alert>
                )}

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        fullWidth
                        label="Email"
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        type="email"
                        value={email}
                    />
                    <TextField
                        autoComplete="current-password"
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type="password"
                        value={password}
                    />
                    <Button
                        aria-busy={isSubmitting}
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </Button>
                </Stack>

                <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
                    Don&apos;t have an account?{' '}
                    <Link component={RouterLink} to="/register" underline="hover">
                        Create an account
                    </Link>
                </Typography>
            </Stack>
        </AuthLayout>
    );
}

export default LoginPage;
