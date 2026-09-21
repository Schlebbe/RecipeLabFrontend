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
