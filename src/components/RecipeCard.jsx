import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RecipeExperimentList from './RecipeExperimentList';
import RecipeIngredientList from './RecipeIngredientList';

function RecipeCard({ ingredients, onDelete, onEdit, recipe }) {
    return (
        <Paper sx={{ p: 2 }} variant="outlined">
            <Stack spacing={1}>
                <Typography component="h3" sx={{ overflowWrap: 'anywhere' }} variant="h5">
                    {recipe.name}
                </Typography>

                {recipe.description && (
                    <Typography sx={{ overflowWrap: 'anywhere' }}>{recipe.description}</Typography>
                )}

                <Typography color="text.secondary" variant="body2">
                    Created {new Date(recipe.createdAtUtc).toLocaleDateString()}
                </Typography>

                <RecipeIngredientList
                    ingredients={ingredients}
                    recipeId={recipe.id}
                />

                <RecipeExperimentList
                    recipeId={recipe.id}
                />

                <Stack
                    direction={{ sm: 'row', xs: 'column' }}
                    spacing={1}
                    sx={{ alignItems: 'flex-start' }}
                >
                    <Button
                        aria-label={`Edit recipe ${recipe.name}`}
                        onClick={() => onEdit(recipe)}
                        size="small"
                        variant="outlined"
                    >
                        Edit
                    </Button>
                    <Button
                        aria-label={`Delete recipe ${recipe.name}`}
                        color="error"
                        onClick={() => onDelete(recipe)}
                        size="small"
                        variant="outlined"
                    >
                        Delete
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default RecipeCard;
