import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { updateRecipe } from '../services/recipeService';

function EditRecipeDialog({ recipe, onClose, onUpdated }) {
    const [name, setName] = useState(recipe.name);
    const [description, setDescription] = useState(recipe.description ?? '');
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
        const trimmedDescription = description.trim();

        if (!trimmedName) {
            setErrorMessage('Recipe name is required.');
            return;
        }

        if (trimmedName.length > 120) {
            setErrorMessage('Recipe name cannot be longer than 120 characters.');
            return;
        }

        if (trimmedDescription.length > 2000) {
            setErrorMessage('Recipe description cannot be longer than 2000 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedRecipe = await updateRecipe(recipe.id, {
                name: trimmedName,
                description: trimmedDescription || null,
            });

            onUpdated(updatedRecipe);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to update the recipe.');
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
            <DialogTitle>Edit recipe</DialogTitle>
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

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            minRows={3}
                            onChange={(event) => setDescription(event.target.value)}
                            value={description}
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

export default EditRecipeDialog;
