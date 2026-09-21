import { apiRequest } from './apiClient';

export function login(credentials) {
    return apiRequest('/Auth/login?useCookies=true', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}
