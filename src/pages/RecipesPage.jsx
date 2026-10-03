import { useEffect, useState } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CreateRecipeDialog from '../components/CreateRecipeDialog';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import EditRecipeDialog from '../components/EditRecipeDialog';
import { PageContainer, PageHeader } from '../components/PageLayout';
import RecipeCard from '../components/RecipeCard';
import { getIngredients } from '../services/ingredientService';
import { deleteRecipe, getRecipes } from '../services/recipeService';

function RecipesPage() {
    const [recipeResults, setRecipeResults] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState({ search: '', page: 1 });
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipeError, setRecipeError] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingredientError, setIngredientError] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const recipes = recipeResults?.items ?? [];
    const searchIsTooLong = searchInput.length > 120;

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function loadRecipes() {
            try {
                const userRecipes = await getRecipes({ ...query, signal: controller.signal });

                if (!isMounted) {
                    return;
                }

                setRecipeResults(userRecipes);
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
            controller.abort();
        };
    }, [query]);

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

    const reloadRecipes = (nextQuery) => {
        setRecipeError('');
        setIsLoadingRecipes(true);
        setQuery(nextQuery);
    };

    const handleSearch = (event) => {
        event.preventDefault();

        if (searchIsTooLong) {
            return;
        }

        reloadRecipes({ search: searchInput.trim(), page: 1 });
    };

    const handleClearSearch = () => {
        setSearchInput('');
        reloadRecipes({ search: '', page: 1 });
    };

    const handleRecipeCreated = () => {
        reloadRecipes({ ...query, page: 1 });
        setIsCreateDialogOpen(false);
    };

    const handleRecipeUpdated = () => {
        reloadRecipes({ ...query, page: recipeResults?.page ?? query.page });
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
            reloadRecipes({ ...query, page: recipeResults?.page ?? query.page });
            setRecipeToDelete(null);
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Unable to delete the recipe.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <PageContainer>
            <Stack spacing={{ md: 4, xs: 3 }}>
                <PageHeader
                    action={(
                        <Button
                            aria-haspopup="dialog"
                            onClick={() => setIsCreateDialogOpen(true)}
                            startIcon={<AddOutlinedIcon />}
                            variant="contained"
                        >
                            Add recipe
                        </Button>
                    )}
                    description="Track your recipes and experiments. Try new ideas, tweak ingredients, and find your favourites."
                    title="Recipes"
                />

                <Stack
                    component="form"
                    direction={{ sm: 'row', xs: 'column' }}
                    onSubmit={handleSearch}
                    role="search"
                    spacing={1.5}
                    sx={{ alignItems: { sm: 'flex-start', xs: 'stretch' } }}
                >
                    <TextField
                        error={searchIsTooLong}
                        fullWidth
                        helperText={searchIsTooLong ? 'Search cannot be longer than 120 characters.' : undefined}
                        label="Search recipes by name"
                        name="recipeSearch"
                        onChange={(event) => setSearchInput(event.target.value)}
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        type="search"
                        value={searchInput}
                    />
                    <Button disabled={searchIsTooLong} type="submit" variant="contained">
                        Search
                    </Button>
                    <Button
                        disabled={!searchInput && !query.search}
                        onClick={handleClearSearch}
                        variant="outlined"
                    >
                        Clear
                    </Button>
                </Stack>

                {ingredientError && <Alert severity="error">{ingredientError}</Alert>}

                {isLoadingRecipes && (
                    <Stack role="status" aria-label="Loading recipes" sx={{ alignItems: 'center' }}>
                        <CircularProgress />
                    </Stack>
                )}

                {!isLoadingRecipes && recipeError && (
                    <Alert
                        action={(
                            <Button color="inherit" onClick={() => reloadRecipes({ ...query })} size="small">
                                Retry
                            </Button>
                        )}
                        severity="error"
                    >
                        {recipeError}
                    </Alert>
                )}

                {!isLoadingRecipes && !recipeError && recipes.length === 0 && (
                    <Typography role="status">
                        {query.search ? 'No recipes match your search.' : 'No recipes yet.'}
                    </Typography>
                )}

                {!isLoadingRecipes && !recipeError && recipes.length > 0 && (
                    <Stack spacing={2}>
                        <Typography color="text.secondary" role="status" variant="body2">
                            Showing {(recipeResults.page - 1) * recipeResults.pageSize + 1}
                            {' - '}{Math.min(recipeResults.page * recipeResults.pageSize, recipeResults.totalCount)}
                            {' of '}{recipeResults.totalCount} recipes
                        </Typography>
                        {recipes.map((recipe) => (
                            <RecipeCard
                                ingredients={ingredients}
                                key={recipe.id}
                                onDelete={handleDeleteClick}
                                onEdit={setRecipeToEdit}
                                recipe={recipe}
                            />
                        ))}
                        {recipeResults.totalPages > 1 && (
                            <Pagination
                                aria-label="Recipe pages"
                                color="primary"
                                count={recipeResults.totalPages}
                                onChange={(_, page) => reloadRecipes({ ...query, page })}
                                page={recipeResults.page}
                                shape="rounded"
                                siblingCount={0}
                                sx={{ alignSelf: 'center' }}
                            />
                        )}
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

            <DeleteConfirmationDialog
                errorMessage={deleteError}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                open={recipeToDelete !== null}
                title="Delete recipe?"
            >
                Are you sure you want to delete "{recipeToDelete?.name}"?
            </DeleteConfirmationDialog>

        </PageContainer>
    );
}

export default RecipesPage;
