import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router';
import { ApiError } from '../services/apiClient';
import { register } from '../services/authService';

function isValidPassword(password) {
    return password.length >= 6 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[^a-zA-Z0-9]/.test(password);
}

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessages([]);

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password || !confirmPassword) {
            setErrorMessages(['Email, password, and password confirmation are required.']);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setErrorMessages(['Enter a valid email address.']);
            return;
        }

        if (!isValidPassword(password)) {
            setErrorMessages(['Password must be at least 6 characters and include uppercase, lowercase, digit, and special character.']);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessages(['Passwords do not match.']);
            return;
        }

        setIsSubmitting(true);

        try {
            await register({ email: trimmedEmail, password });
            navigate('/login', { replace: true, state: { registrationSucceeded: true } });
        } catch (error) {
            let messages = ['Unable to create the account.'];

            if (error instanceof ApiError && error.data?.errors) {
                messages = [];

                for (const fieldErrors of Object.values(error.data.errors)) {
                    messages.push(...fieldErrors);
                }
            } else if (error instanceof Error) {
                messages = [error.message];
            }

            setErrorMessages(messages);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={3}>
                    <Typography component="h1" variant="h4">
                        Create a RecipeLab account
                    </Typography>

                    {errorMessages.length > 0 && (
                        <Alert severity="error">
                            {errorMessages.length === 1 ? errorMessages[0] : (
                                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                                    {errorMessages.map((message, index) => (
                                        <li key={`${message}-${index}`}>{message}</li>
                                    ))}
                                </Box>
                            )}
                        </Alert>
                    )}

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
                            autoComplete="new-password"
                            fullWidth
                            label="Password"
                            name="password"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            type="password"
                            value={password}
                            helperText="At least 6 characters with uppercase, lowercase, number, and special character."
                        />
                        <TextField
                            autoComplete="new-password"
                            fullWidth
                            label="Confirm password"
                            name="confirmPassword"
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                            type="password"
                            value={confirmPassword}
                        />
                        <Button
                            aria-busy={isSubmitting}
                            disabled={isSubmitting}
                            fullWidth
                            type="submit"
                            variant="contained"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                        </Button>
                        <Link component={RouterLink} to="/login" underline="hover" sx={{ alignSelf: 'center' }}>
                            Already have an account? Log in
                        </Link>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
}

export default RegisterPage;
