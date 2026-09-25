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
import { createRecipeExperiment } from '../services/recipeExperimentService';

function CreateRecipeExperimentDialog({ onClose, onCreated, recipeId }) {
    const [preparationMethod, setPreparationMethod] = useState('');
    const [variationNotes, setVariationNotes] = useState('');
    const [resultNotes, setResultNotes] = useState('');
    const [rating, setRating] = useState('');
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

        const trimmedPreparationMethod = preparationMethod.trim();
        const trimmedVariationNotes = variationNotes.trim();
        const trimmedResultNotes = resultNotes.trim();

        if (!trimmedPreparationMethod) {
            setErrorMessage('Preparation method is required.');
            return;
        }

        if (trimmedPreparationMethod.length > 120) {
            setErrorMessage('Preparation method cannot be longer than 120 characters.');
            return;
        }

        if (trimmedVariationNotes.length > 2000) {
            setErrorMessage('Variation notes cannot be longer than 2000 characters.');
            return;
        }

        if (trimmedResultNotes.length > 2000) {
            setErrorMessage('Result notes cannot be longer than 2000 characters.');
            return;
        }

        if (!rating) {
            setErrorMessage('Rating is required.');
            return;
        }

        setIsSubmitting(true);

        try {
            const experiment = await createRecipeExperiment(recipeId, {
                preparationMethod: trimmedPreparationMethod,
                variationNotes: trimmedVariationNotes || null,
                resultNotes: trimmedResultNotes || null,
                rating: Number(rating),
            });

            onCreated(experiment);
            setPreparationMethod('');
            setVariationNotes('');
            setResultNotes('');
            setRating('');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to create the experiment.');
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
            <DialogTitle>Add experiment</DialogTitle>

            <Stack component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={2}>
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                        <TextField
                            autoComplete="off"
                            autoFocus
                            fullWidth
                            label="Preparation method"
                            name="preparationMethod"
                            onChange={(event) => setPreparationMethod(event.target.value)}
                            required
                            value={preparationMethod}
                        />

                        <TextField
                            autoComplete="off"
                            fullWidth
                            label="Variation notes (optional)"
                            multiline
                            name="variationNotes"
                            onChange={(event) => setVariationNotes(event.target.value)}
                            rows={3}
                            value={variationNotes}
                        />

                        <TextField
                            autoComplete="off"
                            fullWidth
                            label="Result notes (optional)"
                            multiline
                            name="resultNotes"
                            onChange={(event) => setResultNotes(event.target.value)}
                            rows={3}
                            value={resultNotes}
                        />

                        <TextField
                            fullWidth
                            label="Rating"
                            name="rating"
                            onChange={(event) => setRating(event.target.value)}
                            required
                            select
                            value={rating}
                        >
                            <MenuItem value="">Select a rating</MenuItem>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value} / 5
                                </MenuItem>
                            ))}
                        </TextField>
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
                        {isSubmitting ? 'Creating...' : 'Create experiment'}
                    </Button>
                </DialogActions>
            </Stack>
        </Dialog>
    );
}

export default CreateRecipeExperimentDialog;
