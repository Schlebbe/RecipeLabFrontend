import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddRecipeIngredientForm from './AddRecipeIngredientForm';
import { getRecipeIngredients } from '../services/recipeIngredientService';

function RecipeIngredientList({ ingredients, recipeId, refreshKey }) {
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadRecipeIngredients() {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const ingredients = await getRecipeIngredients(recipeId);

                if (!isMounted) {
                    return;
                }

                setRecipeIngredients(ingredients);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(error instanceof Error ? error.message : 'Unable to load recipe ingredients.');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadRecipeIngredients();

        return () => {
            isMounted = false;
        };
    }, [recipeId, refreshKey]);

    const handleRecipeIngredientAdded = (recipeIngredient) => {
        setRecipeIngredients((currentRecipeIngredients) => (
            [...currentRecipeIngredients, recipeIngredient]
                .sort((firstIngredient, secondIngredient) => firstIngredient.ingredientName.localeCompare(secondIngredient.ingredientName))
        ));
    };

    return (
        <Stack spacing={1}>
            <Typography component="h4" variant="h6">
                Ingredients
            </Typography>

            {isLoading && (
                <Stack alignItems="center" role="status" aria-label="Loading recipe ingredients">
                    <CircularProgress size={24} />
                </Stack>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}

            {!isLoading && !errorMessage && recipeIngredients.length === 0 && (
                <Typography>No ingredients added.</Typography>
            )}

            {!isLoading && !errorMessage && recipeIngredients.length > 0 && (
                <List disablePadding>
                    {recipeIngredients.map((recipeIngredient, index) => (
                        <ListItem
                            disableGutters
                            divider={index < recipeIngredients.length - 1}
                            key={recipeIngredient.ingredientId}
                        >
                            <ListItemText
                                primary={recipeIngredient.ingredientName}
                                secondary={recipeIngredient.quantity || undefined}
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {!isLoading && !errorMessage && (
                <AddRecipeIngredientForm
                    ingredients={ingredients}
                    onAdded={handleRecipeIngredientAdded}
                    recipeId={recipeId}
                    recipeIngredients={recipeIngredients}
                />
            )}
        </Stack>
    );
}

export default RecipeIngredientList;
