import { apiRequest } from './apiClient';

export function getIngredients() {
    return apiRequest('/Ingredients');
}

export function createIngredient(ingredient) {
    return apiRequest('/Ingredients', {
        method: 'POST',
        body: JSON.stringify(ingredient),
    });
}
