import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageHeader } from './PageLayout';

function formatRating(rating) {
    return Number(rating).toFixed(1);
}

function formatExperimentCount(experimentCount) {
    return `${experimentCount} ${experimentCount === 1 ? 'experiment' : 'experiments'}`;
}

function IconMarker({ children, size = 56, tone = 'primary' }) {
    return (
        <Box
            aria-hidden="true"
            sx={{
                alignItems: 'center',
                bgcolor: `${tone}.light`,
                borderRadius: '50%',
                color: `${tone}.dark`,
                display: 'flex',
                flexShrink: 0,
                height: size,
                justifyContent: 'center',
                width: size,
            }}
        >
            {children}
        </Box>
    );
}

function StatCard({ icon: Icon, label, tone, value, valueVariant = 'h3' }) {
    const headingId = `overview-stat-${label.toLowerCase().replaceAll(' ', '-')}`;

    return (
        <Paper
            aria-labelledby={headingId}
            component="section"
            sx={{ height: '100%', p: { sm: 2.5, xs: 2 } }}
            variant="outlined"
        >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <IconMarker tone={tone}>
                    <Icon sx={{ fontSize: 30 }} />
                </IconMarker>
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography color="text.secondary" component="h2" id={headingId} variant="body2">
                        {label}
                    </Typography>
                    <Typography component="p" sx={{ overflowWrap: 'anywhere' }} variant={valueVariant}>
                        {value}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}

function RatingSummary({ averageRating, experimentCount }) {
    const formattedRating = formatRating(averageRating);

    return (
        <Stack
            direction={{ sm: 'row', xs: 'column' }}
            spacing={{ sm: 1, xs: 0.25 }}
            sx={{ alignItems: { sm: 'center', xs: 'flex-start' } }}
        >
            <Rating
                aria-label={`${formattedRating} out of 5 stars`}
                getLabelText={(value) => `${value} out of 5 stars`}
                max={5}
                precision={0.1}
                readOnly
                size="small"
                sx={{ color: 'secondary.main' }}
                value={Number(averageRating)}
            />
            <Typography color="text.secondary" variant="body2">
                {formatExperimentCount(experimentCount)}
            </Typography>
        </Stack>
    );
}

function RankingCard({ emptyMessage, icon: Icon, idKey, items = [], nameKey, title, tone }) {
    const headingId = `overview-ranking-${title.toLowerCase().replaceAll(' ', '-')}`;

    return (
        <Paper
            aria-labelledby={headingId}
            component="section"
            sx={{ height: '100%', p: { sm: 2.5, xs: 2 } }}
            variant="outlined"
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <IconMarker size={52} tone={tone}>
                        <Icon />
                    </IconMarker>
                    <Typography component="h2" id={headingId} sx={{ overflowWrap: 'anywhere' }} variant="h5">
                        {title}
                    </Typography>
                </Stack>

                {items.length === 0 ? (
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                ) : (
                    <List disablePadding>
                        {items.map((item, index) => (
                            <ListItem
                                disableGutters
                                divider={index < items.length - 1}
                                key={item[idKey]}
                                sx={{ alignItems: 'flex-start', py: 1.5 }}
                            >
                                <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, width: '100%' }}>
                                    <Box
                                        aria-label={`Rank ${index + 1}`}
                                        component="span"
                                        sx={{
                                            alignItems: 'center',
                                            bgcolor: 'secondary.light',
                                            borderRadius: '50%',
                                            color: 'secondary.dark',
                                            display: 'flex',
                                            flexShrink: 0,
                                            height: 34,
                                            justifyContent: 'center',
                                            width: 34,
                                        }}
                                    >
                                        <Typography component="span" fontWeight={700} variant="body2">
                                            {index + 1}
                                        </Typography>
                                    </Box>
                                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                                        <Typography component="h3" sx={{ overflowWrap: 'anywhere' }} variant="h6">
                                            {item[nameKey]}
                                        </Typography>
                                        <RatingSummary
                                            averageRating={item.averageRating}
                                            experimentCount={item.experimentCount}
                                        />
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

function RecipeOverview({ errorMessage, isLoading, statistics }) {
    const averageRating = statistics?.averageRating == null
        ? 'No ratings yet'
        : formatRating(statistics.averageRating);

    const statCards = statistics ? [
        {
            icon: MenuBookOutlinedIcon,
            label: 'Recipes',
            tone: 'secondary',
            value: statistics.recipeCount,
        },
        {
            icon: LocalFloristOutlinedIcon,
            label: 'Ingredients',
            tone: 'primary',
            value: statistics.ingredientCount,
        },
        {
            icon: ScienceOutlinedIcon,
            label: 'Experiments',
            tone: 'primary',
            value: statistics.experimentCount,
        },
        {
            icon: StarOutlinedIcon,
            label: 'Average rating',
            tone: 'secondary',
            value: averageRating,
            valueVariant: averageRating === 'No ratings yet' ? 'h5' : 'h3',
        },
    ] : [];

    return (
        <Stack spacing={{ md: 4, xs: 3 }}>
            <PageHeader
                description="See how your recipes and experiments are developing."
                title="Overview"
            />

            {isLoading && (
                <Stack role="status" aria-label="Loading overview" sx={{ alignItems: 'center', py: 4 }}>
                    <CircularProgress />
                </Stack>
            )}

            {!isLoading && errorMessage && (
                <Alert severity="error">{errorMessage}</Alert>
            )}

            {!isLoading && !errorMessage && statistics && (
                <Stack spacing={{ md: 3, xs: 2 }}>
                    <Grid container spacing={2}>
                        {statCards.map((statCard) => (
                            <Grid key={statCard.label} size={{ lg: 3, sm: 6, xs: 12 }}>
                                <StatCard {...statCard} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid size={{ lg: 4, md: 6, xs: 12 }}>
                            <RankingCard
                                emptyMessage="No rated recipes yet."
                                icon={EmojiEventsOutlinedIcon}
                                idKey="recipeId"
                                items={statistics.topRatedRecipes}
                                nameKey="recipeName"
                                title="Top-rated recipes"
                                tone="secondary"
                            />
                        </Grid>
                        <Grid size={{ lg: 4, md: 6, xs: 12 }}>
                            <RankingCard
                                emptyMessage="No preparation methods rated yet."
                                icon={ScienceOutlinedIcon}
                                idKey="preparationMethod"
                                items={statistics.topRatedPreparationMethods}
                                nameKey="preparationMethod"
                                title="Top-rated preparation methods"
                                tone="primary"
                            />
                        </Grid>
                        <Grid size={{ lg: 4, md: 6, xs: 12 }}>
                            <RankingCard
                                emptyMessage="No rated ingredients yet."
                                icon={LocalFloristOutlinedIcon}
                                idKey="ingredientId"
                                items={statistics.topRatedIngredients}
                                nameKey="ingredientName"
                                title="Top-rated ingredients"
                                tone="secondary"
                            />
                        </Grid>
                    </Grid>
                </Stack>
            )}
        </Stack>
    );
}

export default RecipeOverview;
