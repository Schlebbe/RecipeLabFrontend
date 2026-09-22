import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function IngredientList({ errorMessage, ingredients, isLoading }) {
    return (
        <Stack spacing={2}>
            <Typography component="h2" variant="h4">
                My ingredients
            </Typography>

            {isLoading && (
                <Stack alignItems="center" role="status" aria-label="Loading ingredients">
                    <CircularProgress />
                </Stack>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}

            {!isLoading && !errorMessage && ingredients.length === 0 && (
                <Typography>No ingredients yet.</Typography>
            )}

            {!isLoading && !errorMessage && ingredients.length > 0 && (
                <Paper variant="outlined">
                    <List disablePadding>
                        {ingredients.map((ingredient, index) => (
                            <ListItem
                                divider={index < ingredients.length - 1}
                                key={ingredient.id}
                            >
                                <ListItemText primary={ingredient.name} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Stack>
    );
}

export default IngredientList;
