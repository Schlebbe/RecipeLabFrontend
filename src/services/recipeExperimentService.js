import { apiRequest } from './apiClient';

export function getRecipeExperiments(recipeId) {
    return apiRequest(`/RecipeExperiments/recipe/${recipeId}`);
}

export function createRecipeExperiment(recipeId, experiment) {
    return apiRequest(`/RecipeExperiments/recipe/${recipeId}`, {
        method: 'POST',
        body: JSON.stringify(experiment),
    });
}

export function updateRecipeExperiment(experimentId, experiment) {
    return apiRequest(`/RecipeExperiments/${experimentId}`, {
        method: 'PUT',
        body: JSON.stringify(experiment),
    });
}
