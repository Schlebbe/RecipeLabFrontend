import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function TopRatedList({ idKey, items, nameKey, title }) {
    return (
        <Paper sx={{ flex: 1, minWidth: 0, p: 2 }} variant="outlined">
            <Typography component="h3" variant="h6">
                {title}
            </Typography>

            {items.length === 0 ? (
                <Typography sx={{ mt: 1 }}>No data yet.</Typography>
            ) : (
                <List disablePadding>
                    {items.map((item, index) => {
                        const experimentLabel = item.experimentCount === 1 ? 'experiment' : 'experiments';

                        return (
                            <ListItem
                                disableGutters
                                divider={index < items.length - 1}
                                key={item[idKey]}
                            >
                                <ListItemText
                                    primary={item[nameKey]}
                                    secondary={`${item.averageRating.toFixed(1)} average rating · ${item.experimentCount} ${experimentLabel}`}
                                    sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Paper>
    );
}

function RecipeOverview({ errorMessage, isLoading, statistics }) {
    const averageRating = statistics?.averageRating === null
        ? 'No ratings yet'
        : statistics?.averageRating?.toFixed(1);

    return (
        <Stack spacing={2}>
            <Typography component="h1" variant="h3">
                Overview
            </Typography>

            {isLoading && (
                <Stack alignItems="center" role="status" aria-label="Loading overview">
                    <CircularProgress />
                </Stack>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}

            {!isLoading && !errorMessage && statistics && (
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
                            <Paper sx={{ height: '100%', p: 2 }} variant="outlined">
                                <Typography color="text.secondary" variant="body2">
                                    Recipes
                                </Typography>
                                <Typography component="h3" variant="h4">
                                    {statistics.recipeCount}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
                            <Paper sx={{ height: '100%', p: 2 }} variant="outlined">
                                <Typography color="text.secondary" variant="body2">
                                    Ingredients
                                </Typography>
                                <Typography component="h3" variant="h4">
                                    {statistics.ingredientCount}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
                            <Paper sx={{ height: '100%', p: 2 }} variant="outlined">
                                <Typography color="text.secondary" variant="body2">
                                    Experiments
                                </Typography>
                                <Typography component="h3" variant="h4">
                                    {statistics.experimentCount}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={{ md: 3, sm: 6, xs: 12 }}>
                            <Paper sx={{ height: '100%', p: 2 }} variant="outlined">
                                <Typography color="text.secondary" variant="body2">
                                    Average rating
                                </Typography>
                                <Typography component="h3" variant="h4">
                                    {averageRating}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                        <TopRatedList
                            idKey="recipeId"
                            items={statistics.topRatedRecipes}
                            nameKey="recipeName"
                            title="Top-rated recipes"
                        />
                        <TopRatedList
                            idKey="preparationMethod"
                            items={statistics.topRatedPreparationMethods}
                            nameKey="preparationMethod"
                            title="Top-rated preparation methods"
                        />
                        <TopRatedList
                            idKey="ingredientId"
                            items={statistics.topRatedIngredients}
                            nameKey="ingredientName"
                            title="Top-rated ingredients"
                        />
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}

export default RecipeOverview;
