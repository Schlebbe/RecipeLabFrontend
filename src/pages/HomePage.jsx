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
import EditRecipeDialog from '../components/EditRecipeDialog';
import RecipeForm from '../components/RecipeForm';
import { useAuth } from '../hooks/useAuth';
import { deleteRecipe, getRecipes } from '../services/recipeService';

function HomePage() {
    const { logout } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipeError, setRecipeError] = useState('');
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

    const handleRecipeCreated = (recipe) => {
        setRecipeError('');
        setRecipes((currentRecipes) => [recipe, ...currentRecipes]);
    };

    const handleRecipeUpdated = (updatedRecipe) => {
        setRecipes((currentRecipes) => currentRecipes.map((recipe) => (
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        )));
        setRecipeToEdit(null);
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

                                    <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
                                        <Button
                                            onClick={() => setRecipeToEdit(recipe)}
                                            variant="outlined"
                                        >
                                            Edit
                                        </Button>
                                        <Button
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
        </Container>
    );
}

export default HomePage;
