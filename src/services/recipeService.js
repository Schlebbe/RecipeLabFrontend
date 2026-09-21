import { apiRequest } from './apiClient';

export function getRecipes() {
    return apiRequest('/Recipes');
}
