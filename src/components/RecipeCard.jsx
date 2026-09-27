import { useState } from 'react';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import RecipeExperimentList from './RecipeExperimentList';
import RecipeIngredientList from './RecipeIngredientList';

function RecipeCard({ ingredients, onDelete, onEdit, recipe }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const detailsId = `recipe-details-${recipe.id}`;

    return (
        <Paper
            sx={{
                borderRadius: { sm: 4, xs: 3 },
                overflow: 'hidden',
            }}
            variant="outlined"
        >
            <Stack spacing={0} sx={{ p: { sm: 3, xs: 2 } }}>
                <Stack
                    direction={{ md: 'row', xs: 'column' }}
                    spacing={{ md: 2, xs: 1.5 }}
                    sx={{ alignItems: { md: 'flex-start', xs: 'stretch' } }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{ flex: 1, minWidth: 0, alignItems: 'flex-start' }}
                    >
                        <Box
                            aria-hidden="true"
                            sx={{
                                alignItems: 'center',
                                bgcolor: 'secondary.light',
                                borderRadius: '50%',
                                color: 'secondary.dark',
                                display: 'flex',
                                flexShrink: 0,
                                height: { sm: 64, xs: 56 },
                                justifyContent: 'center',
                                width: { sm: 64, xs: 56 },
                            }}
                        >
                            <AutoStoriesOutlinedIcon sx={{ fontSize: { sm: 34, xs: 30 } }} />
                        </Box>

                        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                            <Typography component="h3" sx={{ overflowWrap: 'anywhere' }} variant="h4">
                                {recipe.name}
                            </Typography>

                            {recipe.description && (
                                <Typography sx={{ overflowWrap: 'anywhere' }} variant="body1">
                                    {recipe.description}
                                </Typography>
                            )}

                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <CalendarTodayOutlinedIcon color="action" fontSize="small" />
                                <Typography color="text.secondary" variant="body2">
                                    Created {new Date(recipe.createdAtUtc).toLocaleDateString()}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                            alignSelf: { md: 'flex-start', xs: 'flex-end' },
                            alignItems: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Tooltip title={isExpanded ? 'Collapse recipe details' : 'Expand recipe details'}>
                            <IconButton
                                aria-controls={detailsId}
                                aria-expanded={isExpanded}
                                aria-label={isExpanded ? 'Collapse recipe details' : 'Expand recipe details'}
                                onClick={() => setIsExpanded((currentValue) => !currentValue)}
                            >
                                <ExpandMoreIcon
                                    sx={{
                                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 180ms ease',
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit recipe">
                            <IconButton
                                aria-label={`Edit recipe ${recipe.name}`}
                                onClick={() => onEdit(recipe)}
                            >
                                <EditOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete recipe">
                            <IconButton
                                aria-label={`Delete recipe ${recipe.name}`}
                                color="error"
                                onClick={() => onDelete(recipe)}
                            >
                                <DeleteOutlineOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Collapse in={isExpanded} unmountOnExit>
                    <Box
                        id={detailsId}
                        sx={{
                            borderTop: 1,
                            borderColor: 'divider',
                            mt: { sm: 3, xs: 2 },
                            pt: { sm: 3, xs: 2 },
                        }}
                    >
                        <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Paper
                                    sx={{
                                        bgcolor: 'background.default',
                                        height: '100%',
                                        p: { sm: 2.5, xs: 2 },
                                    }}
                                    variant="outlined"
                                >
                                    <RecipeIngredientList
                                        ingredients={ingredients}
                                        recipeId={recipe.id}
                                    />
                                </Paper>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Paper
                                    sx={{
                                        bgcolor: 'background.default',
                                        height: '100%',
                                        p: { sm: 2.5, xs: 2 },
                                    }}
                                    variant="outlined"
                                >
                                    <RecipeExperimentList
                                        recipeId={recipe.id}
                                    />
                                </Paper>
                            </Box>
                        </Stack>
                    </Box>
                </Collapse>
            </Stack>
        </Paper>
    );
}

export default RecipeCard;
