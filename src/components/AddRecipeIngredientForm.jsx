import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ApiError } from '../services/apiClient';
import { addRecipeIngredient } from '../services/recipeIngredientService';

function AddRecipeIngredientForm({ ingredients, onAdded, recipeId, recipeIngredients }) {
    const [ingredientId, setIngredientId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const availableIngredients = ingredients.filter((ingredient) => (
        !recipeIngredients.some((recipeIngredient) => recipeIngredient.ingredientId === ingredient.id)
    ));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!ingredientId) {
            setErrorMessage('Please select an ingredient.');
            return;
        }

        const trimmedQuantity = quantity.trim();

        if (trimmedQuantity.length > 80) {
            setErrorMessage('Quantity cannot be longer than 80 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            const recipeIngredient = await addRecipeIngredient(recipeId, {
                ingredientId,
                quantity: trimmedQuantity || null,
            });

            onAdded(recipeIngredient);
            setIngredientId('');
            setQuantity('');
        } catch (error) {
            if (error instanceof ApiError && error.status === 409) {
                setErrorMessage('This ingredient is already added to the recipe.');
            } else {
                setErrorMessage(error instanceof Error ? error.message : 'Unable to add the ingredient.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
            <Typography component="h5" variant="subtitle1">
                Add an ingredient to this recipe
            </Typography>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            {availableIngredients.length === 0 ? (
                <Typography>
                    {ingredients.length === 0
                        ? 'Create an ingredient before adding one to this recipe.'
                        : 'All your ingredients are already added to this recipe.'}
                </Typography>
            ) : (
                <>
                    <TextField
                        fullWidth
                        label="Ingredient"
                        name="ingredientId"
                        onChange={(event) => setIngredientId(event.target.value)}
                        required
                        select
                        value={ingredientId}
                    >
                        <MenuItem value="">Select an ingredient</MenuItem>
                        {availableIngredients.map((ingredient) => (
                            <MenuItem key={ingredient.id} value={ingredient.id}>
                                {ingredient.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        autoComplete="off"
                        fullWidth
                        label="Quantity (optional)"
                        name="quantity"
                        onChange={(event) => setQuantity(event.target.value)}
                        value={quantity}
                    />

                    <Button
                        aria-busy={isSubmitting}
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        {isSubmitting ? 'Adding...' : 'Add ingredient'}
                    </Button>
                </>
            )}
        </Stack>
    );
}

export default AddRecipeIngredientForm;
