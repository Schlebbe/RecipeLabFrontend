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
