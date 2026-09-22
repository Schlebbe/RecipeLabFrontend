import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createIngredient } from '../services/ingredientService';

function IngredientForm({ onCreated }) {
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const ingredient = await createIngredient({ name: trimmedName });

            onCreated(ingredient);
            setName('');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to create the ingredient.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
            <Typography component="h2" variant="h4">
                Add an ingredient
            </Typography>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
                autoComplete="off"
                fullWidth
                label="Name"
                name="name"
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
            />

            <Button
                aria-busy={isSubmitting}
                disabled={isSubmitting}
                type="submit"
                variant="contained"
            >
                {isSubmitting ? 'Creating...' : 'Create ingredient'}
            </Button>
        </Stack>
    );
}

export default IngredientForm;
