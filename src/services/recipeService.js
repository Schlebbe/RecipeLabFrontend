import { apiRequest } from './apiClient';

export function getRecipes() {
    return apiRequest('/Recipes');
}

export function getRecipeStatistics() {
    return apiRequest('/Recipes/statistics');
}

export function createRecipe(recipe) {
    return apiRequest('/Recipes', {
        method: 'POST',
        body: JSON.stringify(recipe),
    });
}

export function updateRecipe(recipeId, recipe) {
    return apiRequest(`/Recipes/${recipeId}`, {
        method: 'PUT',
        body: JSON.stringify(recipe),
    });
}

export function deleteRecipe(recipeId) {
    return apiRequest(`/Recipes/${recipeId}`, {
        method: 'DELETE',
    });
}
