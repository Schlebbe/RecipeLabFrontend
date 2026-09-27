import { useEffect, useState } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
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
        <Stack spacing={1.5}>
            <Stack
                direction={{ sm: 'row', xs: 'column' }}
                spacing={1}
                sx={{ alignItems: { sm: 'center', xs: 'flex-start' }, justifyContent: 'space-between' }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <ScienceOutlinedIcon color="primary" />
                    <Typography component="h3" variant="h5">
                        Experiments
                    </Typography>
                </Stack>

                {!isLoading && !errorMessage && (
                    <Button
                        aria-haspopup="dialog"
                        onClick={() => setIsCreateDialogOpen(true)}
                        size="small"
                        startIcon={<AddOutlinedIcon />}
                        sx={{ alignSelf: { sm: 'auto', xs: 'flex-start' } }}
                        variant="outlined"
                    >
                        Add experiment
                    </Button>
                )}
            </Stack>

            {isLoading && (
                <Stack role="status" aria-label="Loading experiments" sx={{ alignItems: 'center' }}>
                    <CircularProgress size={24} />
                </Stack>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}

            {!isLoading && !errorMessage && experiments.length === 0 && (
                <Typography color="text.secondary">No experiments recorded yet.</Typography>
            )}

            {!isLoading && !errorMessage && experiments.length > 0 && (
                <Stack spacing={1}>
                    {experiments.map((experiment) => (
                        <Paper
                            component="article"
                            key={experiment.id}
                            sx={{ bgcolor: 'background.paper', p: { sm: 2, xs: 1.5 } }}
                            variant="outlined"
                        >
                            <Stack spacing={1}>
                                <Stack
                                    direction={{ sm: 'row', xs: 'column' }}
                                    spacing={1}
                                    sx={{
                                        alignItems: { sm: 'center', xs: 'flex-start' },
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography
                                        component="h4"
                                        sx={{ overflowWrap: 'anywhere' }}
                                        variant="h6"
                                    >
                                        {experiment.preparationMethod}
                                    </Typography>

                                    <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
                                        <Rating
                                            aria-label={`${experiment.rating} out of 5 stars`}
                                            getLabelText={(value) => `${value} out of 5 stars`}
                                            max={5}
                                            precision={1}
                                            readOnly
                                            size="small"
                                            sx={{ color: 'secondary.main' }}
                                            value={Number(experiment.rating)}
                                        />
                                        <Tooltip title="Edit experiment">
                                            <IconButton
                                                aria-label={`Edit ${experiment.preparationMethod} experiment`}
                                                onClick={() => setExperimentToEdit(experiment)}
                                                size="small"
                                                sx={{ minHeight: 40, minWidth: 40 }}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete experiment">
                                            <IconButton
                                                aria-label={`Delete ${experiment.preparationMethod} experiment`}
                                                color="error"
                                                onClick={() => handleExperimentDeleteClick(experiment)}
                                                size="small"
                                                sx={{ minHeight: 40, minWidth: 40 }}
                                            >
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>

                                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                                    <CalendarTodayOutlinedIcon color="action" fontSize="small" />
                                    <Typography color="text.secondary" variant="body2">
                                        Created {new Date(experiment.createdAtUtc).toLocaleDateString()}
                                    </Typography>
                                </Stack>

                                {experiment.variationNotes && (
                                    <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
                                        <strong>Variation:</strong> {experiment.variationNotes}
                                    </Typography>
                                )}

                                {experiment.resultNotes && (
                                    <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
                                        <strong>Result:</strong> {experiment.resultNotes}
                                    </Typography>
                                )}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
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
