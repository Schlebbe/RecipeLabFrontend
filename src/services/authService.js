import { apiRequest } from './apiClient';

export function login(credentials) {
    return apiRequest('/Auth/login?useCookies=true', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export function register(credentials) {
    return apiRequest('/Auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export function getCurrentUser() {
    return apiRequest('/Auth/me');
}

export function logout() {
    return apiRequest('/Auth/logout', {
        method: 'POST',
    });
}
