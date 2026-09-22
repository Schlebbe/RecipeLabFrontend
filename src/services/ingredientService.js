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

export function updateIngredient(ingredientId, ingredient) {
    return apiRequest(`/Ingredients/${ingredientId}`, {
        method: 'PUT',
        body: JSON.stringify(ingredient),
    });
}

export function deleteIngredient(ingredientId) {
    return apiRequest(`/Ingredients/${ingredientId}`, {
        method: 'DELETE',
    });
}
