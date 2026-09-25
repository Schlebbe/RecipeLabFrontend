import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from './authContext';
import { ApiError, registerUnauthorizedHandler } from '../services/apiClient';
import { getCurrentUser, logout as logoutCurrentUser } from '../services/authService';

async function loadCurrentUser() {
    try {
        return await getCurrentUser();
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }

        throw error;
    }
}

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const userRef = useRef(user);

    const refreshUser = async () => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const currentUser = await loadCurrentUser();
            setUser(currentUser);

            return currentUser;
        } catch (error) {
            setUser(null);
            setAuthError(error instanceof Error ? error : new Error('Unable to load the current user.'));

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutCurrentUser();
        } catch (error) {
            if (!(error instanceof ApiError && error.status === 401)) {
                throw error;
            }
        }

        setUser(null);
        setAuthError(null);
    };

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        let isMounted = true;
        const handleUnauthorized = () => {
            if (!isMounted) {
                return;
            }

            setUser(null);
            setAuthError(null);
            setIsLoading(false);

            if (userRef.current !== null) {
                navigate('/login', { replace: true });
            }
        };
        const unregisterUnauthorizedHandler = registerUnauthorizedHandler(handleUnauthorized);

        loadCurrentUser().then((currentUser) => {
            if (!isMounted) {
                return;
            }

            setUser(currentUser);
            setIsLoading(false);
        }).catch((error) => {
            if (!isMounted) {
                return;
            }

            setUser(null);
            setAuthError(error instanceof Error ? error : new Error('Unable to load the current user.'));
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
            unregisterUnauthorizedHandler();
        };
    }, [navigate]);

    const contextValue = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        authError,
        refreshUser,
        logout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
