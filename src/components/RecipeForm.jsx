import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createRecipe } from '../services/recipeService';

function RecipeForm({ onCreated }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const recipe = await createRecipe({
                name: trimmedName,
                description: trimmedDescription || null,
            });

            onCreated(recipe);
            setName('');
            setDescription('');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to create the recipe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
            <Typography component="h2" variant="h4">
                Add a recipe
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

            <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                minRows={3}
                onChange={(event) => setDescription(event.target.value)}
                value={description}
            />

            <Button
                aria-busy={isSubmitting}
                disabled={isSubmitting}
                size="small"
                sx={{ alignSelf: 'flex-start' }}
                type="submit"
                variant="contained"
            >
                {isSubmitting ? 'Creating...' : 'Create recipe'}
            </Button>
        </Stack>
    );
}

export default RecipeForm;
