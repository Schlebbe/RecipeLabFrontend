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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CreateRecipeDialog from '../components/CreateRecipeDialog';
import EditRecipeDialog from '../components/EditRecipeDialog';
import RecipeCard from '../components/RecipeCard';
import { getIngredients } from '../services/ingredientService';
import { deleteRecipe, getRecipes } from '../services/recipeService';

function RecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipeError, setRecipeError] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingredientError, setIngredientError] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
            }
        }

        loadIngredients();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleRecipeCreated = (recipe) => {
        setRecipeError('');
        setRecipes((currentRecipes) => [recipe, ...currentRecipes]);
        setIsCreateDialogOpen(false);
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
                    Recipes
                </Typography>

                {ingredientError && <Alert severity="error">{ingredientError}</Alert>}

                <Button
                    aria-haspopup="dialog"
                    onClick={() => setIsCreateDialogOpen(true)}
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                    variant="contained"
                >
                    Add recipe
                </Button>

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
                            <RecipeCard
                                ingredients={ingredients}
                                key={recipe.id}
                                onDelete={handleDeleteClick}
                                onEdit={setRecipeToEdit}
                                recipe={recipe}
                            />
                        ))}
                    </Stack>
                )}

            </Stack>

            {isCreateDialogOpen && (
                <CreateRecipeDialog
                    onClose={() => setIsCreateDialogOpen(false)}
                    onCreated={handleRecipeCreated}
                />
            )}

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

export default RecipesPage;
