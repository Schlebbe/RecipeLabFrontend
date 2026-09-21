import { apiRequest } from './apiClient';

export function getRecipes() {
    return apiRequest('/Recipes');
}

export function createRecipe(recipe) {
    return apiRequest('/Recipes', {
        method: 'POST',
        body: JSON.stringify(recipe),
    });
}
