import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIngredientDialog from '../components/EditIngredientDialog';
import EditRecipeDialog from '../components/EditRecipeDialog';
import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import RecipeExperimentList from '../components/RecipeExperimentList';
import RecipeForm from '../components/RecipeForm';
import RecipeIngredientList from '../components/RecipeIngredientList';
import RecipeOverview from '../components/RecipeOverview';
import { useAuth } from '../hooks/useAuth';
import { deleteIngredient, getIngredients } from '../services/ingredientService';
import { deleteRecipe, getRecipeStatistics, getRecipes } from '../services/recipeService';

function RecipesPage() {
    const { logout } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipeError, setRecipeError] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
    const [ingredientError, setIngredientError] = useState('');
    const [ingredientsRefreshKey, setIngredientsRefreshKey] = useState(0);
    const [ingredientToEdit, setIngredientToEdit] = useState(null);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);
    const [isDeletingIngredient, setIsDeletingIngredient] = useState(false);
    const [ingredientDeleteError, setIngredientDeleteError] = useState('');
    const [statistics, setStatistics] = useState(null);
    const [isLoadingStatistics, setIsLoadingStatistics] = useState(true);
    const [statisticsError, setStatisticsError] = useState('');
    const [statisticsRefreshKey, setStatisticsRefreshKey] = useState(0);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [recipeToEdit, setRecipeToEdit] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadRecipes() {
            try {
                const userRecipes = await getRecipes();

                if (!isMounted) {
                    return;
                }

                setRecipes(userRecipes);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setRecipeError(error instanceof Error ? error.message : 'Unable to load recipes.');
            } finally {
                if (isMounted) {
                    setIsLoadingRecipes(false);
                }
            }
        }

        loadRecipes();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function loadIngredients() {
            try {
                const userIngredients = await getIngredients();

                if (!isMounted) {
                    return;
                }

                setIngredients(userIngredients);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setIngredientError(error instanceof Error ? error.message : 'Unable to load ingredients.');
            } finally {
                if (isMounted) {
                    setIsLoadingIngredients(false);
                }
            }
        }

        loadIngredients();

        return () => {
            isMounted = false;
        };
    }, [ingredientsRefreshKey]);

    useEffect(() => {
        let isMounted = true;

        async function loadStatistics() {
            try {
                const recipeStatistics = await getRecipeStatistics();

                if (!isMounted) {
                    return;
                }

                setStatistics(recipeStatistics);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setStatisticsError(error instanceof Error ? error.message : 'Unable to load the overview.');
            } finally {
                if (isMounted) {
                    setIsLoadingStatistics(false);
                }
            }
        }

        loadStatistics();

        return () => {
            isMounted = false;
        };
    }, [statisticsRefreshKey]);

    const handleLogout = async () => {
        setErrorMessage('');
        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to log out.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const refreshStatistics = () => {
        setStatisticsError('');
        setIsLoadingStatistics(true);
        setStatisticsRefreshKey((currentKey) => currentKey + 1);
    };

    const refreshIngredients = () => {
        setIngredientError('');
        setIsLoadingIngredients(true);
        setIngredientsRefreshKey((currentKey) => currentKey + 1);
    };

    const handleRecipeCreated = (recipe) => {
        setRecipeError('');
        setRecipes((currentRecipes) => [recipe, ...currentRecipes]);
        refreshStatistics();
    };

    const handleIngredientCreated = () => {
        refreshIngredients();
        refreshStatistics();
    };

    const handleIngredientUpdated = () => {
        refreshIngredients();
        setIngredientToEdit(null);
        refreshStatistics();
    };

    const handleRecipeUpdated = (updatedRecipe) => {
        setRecipes((currentRecipes) => currentRecipes.map((recipe) => (
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        )));
        setRecipeToEdit(null);
        refreshStatistics();
    };

    const handleIngredientDeleteClick = (ingredient) => {
        setIngredientDeleteError('');
        setIngredientToDelete(ingredient);
    };

    const handleCloseIngredientDeleteDialog = () => {
        if (isDeletingIngredient) {
            return;
        }

        setIngredientDeleteError('');
        setIngredientToDelete(null);
    };

    const handleConfirmIngredientDelete = async () => {
        if (!ingredientToDelete) {
            return;
        }

        setIngredientDeleteError('');
        setIsDeletingIngredient(true);

        try {
            await deleteIngredient(ingredientToDelete.id);
            refreshIngredients();
            refreshStatistics();
            setIngredientToDelete(null);
        } catch (error) {
            setIngredientDeleteError(error instanceof Error ? error.message : 'Unable to delete the ingredient.');
        } finally {
            setIsDeletingIngredient(false);
        }
    };

    const handleDeleteClick = (recipe) => {
        setDeleteError('');
        setRecipeToDelete(recipe);
    };

    const handleCloseDeleteDialog = () => {
        if (isDeleting) {
            return;
        }

        setDeleteError('');
        setRecipeToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!recipeToDelete) {
            return;
        }

        setDeleteError('');
        setIsDeleting(true);

        try {
            await deleteRecipe(recipeToDelete.id);
            setRecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== recipeToDelete.id));
            refreshStatistics();
            setRecipeToDelete(null);
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Unable to delete the recipe.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <Typography component="h1" variant="h3">
                    RecipeLab
                </Typography>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <RecipeForm onCreated={handleRecipeCreated} />

                <IngredientForm onCreated={handleIngredientCreated} />

                <RecipeOverview
                    errorMessage={statisticsError}
                    isLoading={isLoadingStatistics}
                    statistics={statistics}
                />

                <Typography component="h2" variant="h4">
                    My recipes
                </Typography>

                {isLoadingRecipes && (
                    <Stack alignItems="center" role="status" aria-label="Loading recipes">
                        <CircularProgress />
                    </Stack>
                )}

                {!isLoadingRecipes && recipeError && (
                    <Alert severity="error">{recipeError}</Alert>
                )}

                {!isLoadingRecipes && !recipeError && recipes.length === 0 && (
                    <Typography>No recipes yet.</Typography>
                )}

                {!isLoadingRecipes && !recipeError && recipes.length > 0 && (
                    <Stack spacing={2}>
                        {recipes.map((recipe) => (
                            <Paper key={recipe.id} sx={{ p: 2 }} variant="outlined">
                                <Stack spacing={1}>
                                    <Typography component="h3" variant="h5">
                                        {recipe.name}
                                    </Typography>

                                    {recipe.description && (
                                        <Typography>{recipe.description}</Typography>
                                    )}

                                    <Typography color="text.secondary" variant="body2">
                                        Created {new Date(recipe.createdAtUtc).toLocaleDateString()}
                                    </Typography>

                                    <RecipeIngredientList
                                        ingredients={ingredients}
                                        onAssociationChanged={refreshStatistics}
                                        recipeId={recipe.id}
                                        refreshKey={ingredientsRefreshKey}
                                    />

                                    <RecipeExperimentList
                                        onExperimentChanged={refreshStatistics}
                                        recipeId={recipe.id}
                                    />

                                    <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
                                        <Button
                                            aria-label={`Edit recipe ${recipe.name}`}
                                            onClick={() => setRecipeToEdit(recipe)}
                                            variant="outlined"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            aria-label={`Delete recipe ${recipe.name}`}
                                            color="error"
                                            onClick={() => handleDeleteClick(recipe)}
                                            variant="outlined"
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}

                <IngredientList
                    errorMessage={ingredientError}
                    ingredients={ingredients}
                    isLoading={isLoadingIngredients}
                    onDelete={handleIngredientDeleteClick}
                    onEdit={(ingredient) => setIngredientToEdit(ingredient)}
                />

                <Button
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    variant="outlined"
                >
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                </Button>
            </Stack>

            {recipeToEdit && (
                <EditRecipeDialog
                    onClose={() => setRecipeToEdit(null)}
                    onUpdated={handleRecipeUpdated}
                    recipe={recipeToEdit}
                />
            )}

            {ingredientToEdit && (
                <EditIngredientDialog
                    ingredient={ingredientToEdit}
                    onClose={() => setIngredientToEdit(null)}
                    onUpdated={handleIngredientUpdated}
                />
            )}

            <Dialog
                fullWidth
                maxWidth="sm"
                onClose={handleCloseDeleteDialog}
                open={recipeToDelete !== null}
            >
                <DialogTitle>Delete recipe?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{recipeToDelete?.name}"?
                    </DialogContentText>

                    {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button disabled={isDeleting} onClick={handleCloseDeleteDialog}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        disabled={isDeleting}
                        onClick={handleConfirmDelete}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth
                maxWidth="sm"
                onClose={handleCloseIngredientDeleteDialog}
                open={ingredientToDelete !== null}
            >
                <DialogTitle>Delete ingredient?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deleting this ingredient will also remove it from any recipes that use it. Are you sure you want to delete "{ingredientToDelete?.name}"?
                    </DialogContentText>

                    {ingredientDeleteError && <Alert severity="error" sx={{ mt: 2 }}>{ingredientDeleteError}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button disabled={isDeletingIngredient} onClick={handleCloseIngredientDeleteDialog}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        disabled={isDeletingIngredient}
                        onClick={handleConfirmIngredientDelete}
                    >
                        {isDeletingIngredient ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default RecipesPage;
