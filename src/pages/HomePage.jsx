import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RecipeForm from '../components/RecipeForm';
import { useAuth } from '../hooks/useAuth';
import { getRecipes } from '../services/recipeService';

function HomePage() {
    const { logout } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [recipeError, setRecipeError] = useState('');

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
                                <Typography component="h3" variant="h5">
                                    {recipe.name}
                                </Typography>

                                {recipe.description && (
                                    <Typography>{recipe.description}</Typography>
                                )}

                                <Typography color="text.secondary" variant="body2">
                                    Created {new Date(recipe.createdAtUtc).toLocaleDateString()}
                                </Typography>
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
        </Container>
    );
}

export default HomePage;
