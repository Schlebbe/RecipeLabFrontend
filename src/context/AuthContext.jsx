import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { ApiError } from '../services/apiClient';
import { getCurrentUser } from '../services/authService';

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
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

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

    useEffect(() => {
        let isMounted = true;

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
        };
    }, []);

    const contextValue = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        authError,
        refreshUser,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
