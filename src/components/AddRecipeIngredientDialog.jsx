import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ApiError } from '../services/apiClient';
import { addRecipeIngredient } from '../services/recipeIngredientService';

function AddRecipeIngredientDialog({ ingredients, onAdded, onClose, recipeId, recipeIngredients }) {
    const [ingredientId, setIngredientId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const availableIngredients = ingredients.filter((ingredient) => (
        !recipeIngredients.some((recipeIngredient) => recipeIngredient.ingredientId === ingredient.id)
    ));

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        onClose();
    };

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
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={handleClose}
            open
        >
            <DialogTitle>Add ingredient to recipe</DialogTitle>

            <Stack component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={2}>
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                        <TextField
                            autoFocus
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
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button disabled={isSubmitting} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        aria-busy={isSubmitting}
                        disabled={isSubmitting}
                        size="small"
                        type="submit"
                        variant="contained"
                    >
                        {isSubmitting ? 'Adding...' : 'Add ingredient'}
                    </Button>
                </DialogActions>
            </Stack>
        </Dialog>
    );
}

export default AddRecipeIngredientDialog;
