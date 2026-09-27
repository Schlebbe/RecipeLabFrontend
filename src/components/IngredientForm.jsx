import { useState } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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
        <Paper
            aria-labelledby="add-ingredient-heading"
            component="section"
            sx={{ p: { sm: 3, xs: 2 } }}
            variant="outlined"
        >
            <Stack
                direction={{ md: 'row', xs: 'column' }}
                spacing={{ md: 4, xs: 2.5 }}
                sx={{ alignItems: { md: 'center', xs: 'stretch' } }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'flex-start', flex: { md: 1, xs: 'initial' }, minWidth: 0 }}
                >
                    <Box
                        aria-hidden="true"
                        sx={{
                            alignItems: 'center',
                            bgcolor: 'primary.light',
                            borderRadius: '50%',
                            color: 'primary.dark',
                            display: 'flex',
                            flexShrink: 0,
                            height: { sm: 64, xs: 56 },
                            justifyContent: 'center',
                            width: { sm: 64, xs: 56 },
                        }}
                    >
                        <LocalFloristOutlinedIcon sx={{ fontSize: { sm: 34, xs: 30 } }} />
                    </Box>
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography component="h2" id="add-ingredient-heading" variant="h4">
                            Add an ingredient
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Create an ingredient to use in your recipes.
                        </Typography>
                    </Stack>
                </Stack>

                <Stack
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    spacing={1.5}
                    sx={{ flex: { md: 1.5, xs: 'initial' }, minWidth: 0 }}
                >
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={1.5}>
                        <TextField
                            autoComplete="off"
                            fullWidth
                            label="Name"
                            name="name"
                            onChange={(event) => setName(event.target.value)}
                            required
                            sx={{ flex: 1, minWidth: 0 }}
                            value={name}
                        />

                        <Button
                            aria-busy={isSubmitting}
                            disabled={isSubmitting}
                            startIcon={<AddOutlinedIcon />}
                            sx={{ flexShrink: 0, width: { md: 'auto', xs: '100%' } }}
                            type="submit"
                            variant="contained"
                        >
                            {isSubmitting ? 'Creating...' : 'Create ingredient'}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default IngredientForm;
