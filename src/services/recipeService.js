import { apiRequest } from './apiClient';

export function getRecipes({ search = '', page = 1, pageSize = 10, signal } = {}) {
    return apiRequest('/Recipes', {
        params: { search, page, pageSize },
        signal,
    });
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
