import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { updateIngredient } from '../services/ingredientService';

function EditIngredientDialog({ ingredient, onClose, onUpdated }) {
    const [name, setName] = useState(ingredient.name);
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

        const trimmedName = name.trim();

        if (!trimmedName) {
            setErrorMessage('Ingredient name is required.');
            return;
        }

        if (trimmedName.length > 120) {
            setErrorMessage('Ingredient name cannot be longer than 120 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedIngredient = await updateIngredient(ingredient.id, { name: trimmedName });

            onUpdated(updatedIngredient);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to update the ingredient.');
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
            <DialogTitle>Edit ingredient</DialogTitle>
            <Stack component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={2}>
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                        <TextField
                            autoComplete="off"
                            autoFocus
                            fullWidth
                            label="Name"
                            name="name"
                            onChange={(event) => setName(event.target.value)}
                            required
                            value={name}
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

export default EditIngredientDialog;
