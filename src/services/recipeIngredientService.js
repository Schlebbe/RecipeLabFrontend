import { apiRequest } from './apiClient';

export function getRecipeIngredients(recipeId) {
    return apiRequest(`/RecipeIngredients/recipe/${recipeId}`);
}
