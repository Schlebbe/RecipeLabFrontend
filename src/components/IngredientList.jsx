import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function IngredientList({ errorMessage, ingredients, isLoading, onDelete, onEdit }) {
    return (
        <Paper
            aria-labelledby="ingredient-library-heading"
            component="section"
            sx={{ p: { sm: 2.5, xs: 2 } }}
            variant="outlined"
        >
            <Stack spacing={2}>
                <Stack
                    direction={{ sm: 'row', xs: 'column' }}
                    spacing={1}
                    sx={{ alignItems: { sm: 'center', xs: 'flex-start' }, justifyContent: 'space-between' }}
                >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <LocalFloristOutlinedIcon color="primary" />
                        <Typography component="h2" id="ingredient-library-heading" variant="h4">
                            My ingredients
                        </Typography>
                    </Stack>

                    {!isLoading && !errorMessage && (
                        <Typography color="text.secondary" variant="body2">
                            {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
                        </Typography>
                    )}
                </Stack>

                {isLoading && (
                    <Stack role="status" aria-label="Loading ingredients" sx={{ alignItems: 'center', py: 3 }}>
                        <CircularProgress />
                    </Stack>
                )}

                {!isLoading && errorMessage && (
                    <Alert severity="error">{errorMessage}</Alert>
                )}

                {!isLoading && !errorMessage && ingredients.length === 0 && (
                    <Stack
                        spacing={1}
                        sx={{
                            alignItems: 'center',
                            bgcolor: 'background.default',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            color: 'text.secondary',
                            px: 2,
                            py: 4,
                            textAlign: 'center',
                        }}
                    >
                        <LocalFloristOutlinedIcon color="primary" />
                        <Typography>No ingredients yet. Add your first ingredient above.</Typography>
                    </Stack>
                )}

                {!isLoading && !errorMessage && ingredients.length > 0 && (
                    <List
                        disablePadding
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        {ingredients.map((ingredient, index) => (
                            <ListItem
                                disableGutters
                                divider={index < ingredients.length - 1}
                                key={ingredient.id}
                                sx={{ px: { sm: 1.5, xs: 1 }, py: 1 }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={{ sm: 1.5, xs: 1 }}
                                    sx={{ alignItems: 'center', minWidth: 0, width: '100%' }}
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
                                            height: 40,
                                            justifyContent: 'center',
                                            width: 40,
                                        }}
                                    >
                                        <LocalFloristOutlinedIcon fontSize="small" />
                                    </Box>
                                    <ListItemText
                                        primary={ingredient.name}
                                        sx={{
                                            minWidth: 0,
                                            '& .MuiListItemText-primary': {
                                                fontWeight: 600,
                                                overflowWrap: 'anywhere',
                                            },
                                        }}
                                    />
                                    <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
                                        <Tooltip title="Edit ingredient">
                                            <IconButton
                                                aria-label={`Edit ingredient ${ingredient.name}`}
                                                onClick={() => onEdit(ingredient)}
                                                size="small"
                                                sx={{ minHeight: 40, minWidth: 40 }}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete ingredient">
                                            <IconButton
                                                aria-label={`Delete ingredient ${ingredient.name}`}
                                                color="error"
                                                onClick={() => onDelete(ingredient)}
                                                size="small"
                                                sx={{ minHeight: 40, minWidth: 40 }}
                                            >
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Stack>
        </Paper>
    );
}

export default IngredientList;
