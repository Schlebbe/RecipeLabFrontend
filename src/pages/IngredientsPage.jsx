import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import EditIngredientDialog from '../components/EditIngredientDialog';
import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import { deleteIngredient, getIngredients } from '../services/ingredientService';

function IngredientsPage() {
    const [ingredients, setIngredients] = useState([]);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
    const [ingredientError, setIngredientError] = useState('');
    const [ingredientsRefreshKey, setIngredientsRefreshKey] = useState(0);
    const [ingredientToEdit, setIngredientToEdit] = useState(null);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);
    const [isDeletingIngredient, setIsDeletingIngredient] = useState(false);
    const [ingredientDeleteError, setIngredientDeleteError] = useState('');

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

    const refreshIngredients = () => {
        setIngredientError('');
        setIsLoadingIngredients(true);
        setIngredientsRefreshKey((currentKey) => currentKey + 1);
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
            setIngredientToDelete(null);
        } catch (error) {
            setIngredientDeleteError(error instanceof Error ? error.message : 'Unable to delete the ingredient.');
        } finally {
            setIsDeletingIngredient(false);
        }
    };

    const handleIngredientUpdated = () => {
        refreshIngredients();
        setIngredientToEdit(null);
    };

    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <Typography component="h1" variant="h3">
                    Ingredients
                </Typography>

                <IngredientForm onCreated={refreshIngredients} />

                <IngredientList
                    errorMessage={ingredientError}
                    ingredients={ingredients}
                    isLoading={isLoadingIngredients}
                    onDelete={handleIngredientDeleteClick}
                    onEdit={(ingredient) => setIngredientToEdit(ingredient)}
                />
            </Stack>

            {ingredientToEdit && (
                <EditIngredientDialog
                    ingredient={ingredientToEdit}
                    onClose={() => setIngredientToEdit(null)}
                    onUpdated={handleIngredientUpdated}
                />
            )}

            <DeleteConfirmationDialog
                errorMessage={ingredientDeleteError}
                isDeleting={isDeletingIngredient}
                onClose={handleCloseIngredientDeleteDialog}
                onConfirm={handleConfirmIngredientDelete}
                open={ingredientToDelete !== null}
                title="Delete ingredient?"
            >
                Deleting this ingredient will also remove it from any recipes that use it. Are you sure you want to delete "{ingredientToDelete?.name}"?
            </DeleteConfirmationDialog>
        </Container>
    );
}

export default IngredientsPage;
