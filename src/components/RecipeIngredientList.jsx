import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddRecipeIngredientDialog from './AddRecipeIngredientDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import EditRecipeIngredientDialog from './EditRecipeIngredientDialog';
import { deleteRecipeIngredient, getRecipeIngredients } from '../services/recipeIngredientService';

function RecipeIngredientList({ ingredients, recipeId, refreshKey }) {
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [recipeIngredientToEdit, setRecipeIngredientToEdit] = useState(null);
    const [recipeIngredientToDelete, setRecipeIngredientToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

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

    const availableIngredients = ingredients.filter((ingredient) => (
        !recipeIngredients.some((recipeIngredient) => recipeIngredient.ingredientId === ingredient.id)
    ));

    const handleRecipeIngredientAdded = (recipeIngredient) => {
        setRecipeIngredients((currentRecipeIngredients) => (
            [...currentRecipeIngredients, recipeIngredient]
                .sort((firstIngredient, secondIngredient) => firstIngredient.ingredientName.localeCompare(secondIngredient.ingredientName))
        ));
        setIsCreateDialogOpen(false);
    };

    const handleRecipeIngredientUpdated = (updatedRecipeIngredient) => {
        setRecipeIngredients((currentRecipeIngredients) => currentRecipeIngredients.map((recipeIngredient) => (
            recipeIngredient.ingredientId === updatedRecipeIngredient.ingredientId
                ? updatedRecipeIngredient
                : recipeIngredient
        )));
        setRecipeIngredientToEdit(null);
    };

    const handleRecipeIngredientDeleteClick = (recipeIngredient) => {
        setDeleteError('');
        setRecipeIngredientToDelete(recipeIngredient);
    };

    const handleCloseDeleteDialog = () => {
        if (isDeleting) {
            return;
        }

        setDeleteError('');
        setRecipeIngredientToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!recipeIngredientToDelete) {
            return;
        }

        setDeleteError('');
        setIsDeleting(true);

        try {
            await deleteRecipeIngredient(recipeId, recipeIngredientToDelete.ingredientId);
            setRecipeIngredients((currentRecipeIngredients) => currentRecipeIngredients.filter((recipeIngredient) => (
                recipeIngredient.ingredientId !== recipeIngredientToDelete.ingredientId
            )));
            setRecipeIngredientToDelete(null);
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Unable to remove the ingredient from the recipe.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Stack spacing={1}>
            <Typography component="h4" variant="h6">
                Ingredients
            </Typography>

            {isLoading && (
                <Stack role="status" aria-label="Loading recipe ingredients" sx={{ alignItems: 'center' }}>
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
                            <Stack
                                direction={{ sm: 'row', xs: 'column' }}
                                spacing={1}
                                sx={{ width: '100%' }}
                            >
                                <ListItemText
                                    primary={recipeIngredient.ingredientName}
                                    secondary={recipeIngredient.quantity || undefined}
                                    sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
                                />
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        aria-label={`Edit ${recipeIngredient.ingredientName} quantity`}
                                        onClick={() => setRecipeIngredientToEdit(recipeIngredient)}
                                        size="small"
                                        variant="outlined"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        aria-label={`Delete ${recipeIngredient.ingredientName} from recipe`}
                                        color="error"
                                        onClick={() => handleRecipeIngredientDeleteClick(recipeIngredient)}
                                        size="small"
                                        variant="outlined"
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            )}

            {!isLoading && !errorMessage && (
                availableIngredients.length === 0 ? (
                    <Typography>
                        {ingredients.length === 0
                            ? 'Create an ingredient before adding one to this recipe.'
                            : 'All your ingredients are already added to this recipe.'}
                    </Typography>
                ) : (
                    <>
                        <Button
                            aria-haspopup="dialog"
                            onClick={() => setIsCreateDialogOpen(true)}
                            size="small"
                            sx={{ alignSelf: 'flex-start' }}
                            variant="contained"
                        >
                            Add ingredient
                        </Button>

                        {isCreateDialogOpen && (
                            <AddRecipeIngredientDialog
                                ingredients={ingredients}
                                onAdded={handleRecipeIngredientAdded}
                                onClose={() => setIsCreateDialogOpen(false)}
                                recipeId={recipeId}
                                recipeIngredients={recipeIngredients}
                            />
                        )}
                    </>
                )
            )}

            <DeleteConfirmationDialog
                actionLabel="Remove"
                actionPendingLabel="Removing..."
                errorMessage={deleteError}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                open={recipeIngredientToDelete !== null}
                title="Remove ingredient from recipe?"
            >
                This will only remove "{recipeIngredientToDelete?.ingredientName}" from this recipe. The ingredient itself will not be deleted. Are you sure you want to continue?
            </DeleteConfirmationDialog>

            {recipeIngredientToEdit && (
                <EditRecipeIngredientDialog
                    onClose={() => setRecipeIngredientToEdit(null)}
                    onUpdated={handleRecipeIngredientUpdated}
                    recipeId={recipeId}
                    recipeIngredient={recipeIngredientToEdit}
                />
            )}
        </Stack>
    );
}

export default RecipeIngredientList;
