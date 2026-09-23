import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function AppLayout() {
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
        <>
            <AppBar position="static">
                <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
                    <Typography
                        component="div"
                        sx={{ flexGrow: 1, minWidth: 120 }}
                        variant="h6"
                    >
                        RecipeLab
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            size="small"
                            to="/recipes"
                        >
                            Recipes
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            size="small"
                            to="/ingredients"
                        >
                            Ingredients
                        </Button>
                        <Button
                            aria-busy={isLoggingOut}
                            color="inherit"
                            disabled={isLoggingOut}
                            onClick={handleLogout}
                            size="small"
                        >
                            {isLoggingOut ? 'Logging out...' : 'Log out'}
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Box component="main" sx={{ py: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}

export default AppLayout;
