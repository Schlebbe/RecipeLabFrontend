import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
    const { logout } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setErrorMessage('');
        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to log out.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <Typography component="h1" variant="h3">
                    RecipeLab
                </Typography>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Button
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    variant="outlined"
                >
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                </Button>
            </Stack>
        </Container>
    );
}

export default HomePage;
