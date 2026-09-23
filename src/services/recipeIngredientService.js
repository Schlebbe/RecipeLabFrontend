import { apiRequest } from './apiClient';

export function getRecipeIngredients(recipeId) {
    return apiRequest(`/RecipeIngredients/recipe/${recipeId}`);
}

export function addRecipeIngredient(recipeId, recipeIngredient) {
    return apiRequest(`/RecipeIngredients/recipe/${recipeId}`, {
        method: 'POST',
        body: JSON.stringify(recipeIngredient),
    });
}

export function updateRecipeIngredient(recipeId, ingredientId, recipeIngredient) {
    return apiRequest(`/RecipeIngredients/recipe/${recipeId}/ingredient/${ingredientId}`, {
        method: 'PUT',
        body: JSON.stringify(recipeIngredient),
    });
}

export function deleteRecipeIngredient(recipeId, ingredientId) {
    return apiRequest(`/RecipeIngredients/recipe/${recipeId}/ingredient/${ingredientId}`, {
        method: 'DELETE',
    });
}
