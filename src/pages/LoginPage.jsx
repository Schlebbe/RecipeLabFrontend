import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router';
import { login } from '../services/authService';

function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
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
            navigate('/', { replace: true });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to log in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={3}>
                    <Typography component="h1" variant="h4">
                        Log in to RecipeLab
                    </Typography>

                    {location.state?.registrationSucceeded && (
                        <Alert severity="success">Registration successful. You can now log in.</Alert>
                    )}

                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                    <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
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
                            type="submit"
                            variant="contained"
                        >
                            {isSubmitting ? 'Logging in...' : 'Log in'}
                        </Button>
                        <Link component={RouterLink} to="/register" underline="hover" sx={{ alignSelf: 'center' }}>
                            Create an account
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}

export default LoginPage;
