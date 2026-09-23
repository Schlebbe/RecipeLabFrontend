import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CreateRecipeExperimentForm from './CreateRecipeExperimentForm';
import EditRecipeExperimentDialog from './EditRecipeExperimentDialog';
import { getRecipeExperiments } from '../services/recipeExperimentService';

function RecipeExperimentList({ onExperimentChanged, recipeId }) {
    const [experiments, setExperiments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [experimentToEdit, setExperimentToEdit] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadExperiments() {
            try {
                const recipeExperiments = await getRecipeExperiments(recipeId);

                if (!isMounted) {
                    return;
                }

                setExperiments(recipeExperiments);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(error instanceof Error ? error.message : 'Unable to load experiments.');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadExperiments();

        return () => {
            isMounted = false;
        };
    }, [recipeId]);

    const handleExperimentCreated = (experiment) => {
        setExperiments((currentExperiments) => [experiment, ...currentExperiments]);
        onExperimentChanged();
    };

    const handleExperimentUpdated = (updatedExperiment) => {
        setExperiments((currentExperiments) => currentExperiments.map((experiment) => (
            experiment.id === updatedExperiment.id ? updatedExperiment : experiment
        )));
        setExperimentToEdit(null);
        onExperimentChanged();
    };

    return (
        <Stack spacing={1}>
            <Typography component="h4" variant="h6">
                Experiments
            </Typography>

            {isLoading && (
                <Stack alignItems="center" role="status" aria-label="Loading experiments">
                    <CircularProgress size={24} />
                </Stack>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}

            {!isLoading && !errorMessage && experiments.length === 0 && (
                <Typography>No experiments yet.</Typography>
            )}

            {!isLoading && !errorMessage && experiments.length > 0 && (
                <List disablePadding>
                    {experiments.map((experiment, index) => {
                        const notes = [
                            experiment.variationNotes && `Variation: ${experiment.variationNotes}`,
                            experiment.resultNotes && `Result: ${experiment.resultNotes}`,
                            `Created ${new Date(experiment.createdAtUtc).toLocaleDateString()}`,
                        ].filter(Boolean).join(' · ');

                        return (
                            <ListItem
                                disableGutters
                                divider={index < experiments.length - 1}
                                key={experiment.id}
                            >
                                <Stack
                                    direction={{ sm: 'row', xs: 'column' }}
                                    spacing={1}
                                    sx={{ width: '100%' }}
                                >
                                    <ListItemText
                                        primary={`${experiment.preparationMethod} · ${experiment.rating}/5`}
                                        secondary={notes}
                                    />
                                    <Button
                                        onClick={() => setExperimentToEdit(experiment)}
                                        variant="outlined"
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            </ListItem>
                        );
                    })}
                </List>
            )}

            {!isLoading && !errorMessage && (
                <CreateRecipeExperimentForm
                    onCreated={handleExperimentCreated}
                    recipeId={recipeId}
                />
            )}

            {experimentToEdit && (
                <EditRecipeExperimentDialog
                    experiment={experimentToEdit}
                    onClose={() => setExperimentToEdit(null)}
                    onUpdated={handleExperimentUpdated}
                />
            )}
        </Stack>
    );
}

export default RecipeExperimentList;
