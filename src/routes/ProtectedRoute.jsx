import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute() {
    const { isAuthenticated, isLoading, authError, refreshUser } = useAuth();
    const location = useLocation();

    async function handleRetry() {
        try {
            await refreshUser();
        } catch {
            return null;
        }
    }

    if (isLoading) {
        return (
            <Box
                role="status"
                aria-label="Loading"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '50vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (authError) {
        return (
            <Alert
                severity="error"
                action={
                    <Button color="inherit" size="small" onClick={handleRetry}>
                        Try again
                    </Button>
                }
            >
                Unable to load your account.
            </Alert>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;
