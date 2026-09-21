import { Alert, Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute() {
    const { isAuthenticated, isLoading, authError } = useAuth();
    const location = useLocation();

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
            <Alert severity="error">
                Unable to load your account. Please try again.
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
