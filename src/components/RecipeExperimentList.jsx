import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CreateRecipeExperimentDialog from './CreateRecipeExperimentDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import EditRecipeExperimentDialog from './EditRecipeExperimentDialog';
import { deleteRecipeExperiment, getRecipeExperiments } from '../services/recipeExperimentService';

function RecipeExperimentList({ recipeId }) {
    const [experiments, setExperiments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [experimentToEdit, setExperimentToEdit] = useState(null);
    const [experimentToDelete, setExperimentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

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
        setIsCreateDialogOpen(false);
    };

    const handleExperimentUpdated = (updatedExperiment) => {
        setExperiments((currentExperiments) => currentExperiments.map((experiment) => (
            experiment.id === updatedExperiment.id ? updatedExperiment : experiment
        )));
        setExperimentToEdit(null);
    };

    const handleExperimentDeleteClick = (experiment) => {
        setDeleteError('');
        setExperimentToDelete(experiment);
    };

    const handleCloseDeleteDialog = () => {
        if (isDeleting) {
            return;
        }

        setDeleteError('');
        setExperimentToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!experimentToDelete) {
            return;
        }

        setDeleteError('');
        setIsDeleting(true);

        try {
            await deleteRecipeExperiment(experimentToDelete.id);
            setExperiments((currentExperiments) => currentExperiments.filter((experiment) => (
                experiment.id !== experimentToDelete.id
            )));
            setExperimentToDelete(null);
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'Unable to delete the experiment.');
        } finally {
            setIsDeleting(false);
        }
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
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            aria-label={`Edit ${experiment.preparationMethod} experiment`}
                                            onClick={() => setExperimentToEdit(experiment)}
                                            size="small"
                                            variant="outlined"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            aria-label={`Delete ${experiment.preparationMethod} experiment`}
                                            color="error"
                                            onClick={() => handleExperimentDeleteClick(experiment)}
                                            size="small"
                                            variant="outlined"
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        );
                    })}
                </List>
            )}

            {!isLoading && !errorMessage && (
                <Button
                    aria-haspopup="dialog"
                    onClick={() => setIsCreateDialogOpen(true)}
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                    variant="contained"
                >
                    Add experiment
                </Button>
            )}

            {isCreateDialogOpen && (
                <CreateRecipeExperimentDialog
                    onClose={() => setIsCreateDialogOpen(false)}
                    onCreated={handleExperimentCreated}
                    recipeId={recipeId}
                />
            )}

            <DeleteConfirmationDialog
                errorMessage={deleteError}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                open={experimentToDelete !== null}
                title="Delete experiment?"
            >
                This will permanently delete the experiment and its rating from this recipe. Are you sure you want to delete "{experimentToDelete?.preparationMethod}"?
            </DeleteConfirmationDialog>

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
