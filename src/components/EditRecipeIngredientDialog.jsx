import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { updateRecipeIngredient } from '../services/recipeIngredientService';

function EditRecipeIngredientDialog({ recipeId, recipeIngredient, onClose, onUpdated }) {
    const [quantity, setQuantity] = useState(recipeIngredient.quantity ?? '');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        const trimmedQuantity = quantity.trim();

        if (trimmedQuantity.length > 80) {
            setErrorMessage('Quantity cannot be longer than 80 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedRecipeIngredient = await updateRecipeIngredient(
                recipeId,
                recipeIngredient.ingredientId,
                { quantity: trimmedQuantity || null }
            );

            onUpdated(updatedRecipeIngredient);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to update the ingredient quantity.');
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
            <DialogTitle>Edit ingredient quantity</DialogTitle>
            <Stack component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={2}>
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                        <TextField
                            autoComplete="off"
                            autoFocus
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
                        type="submit"
                        variant="contained"
                    >
                        {isSubmitting ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogActions>
            </Stack>
        </Dialog>
    );
}

export default EditRecipeIngredientDialog;
