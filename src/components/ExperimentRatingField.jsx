import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Rating from '@mui/material/Rating';

function ExperimentRatingField({ onChange, value }) {
    return (
        <FormControl component="fieldset" required>
            <FormLabel component="legend" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Rating
            </FormLabel>
            <Rating
                aria-label="Rating from one to five stars"
                getLabelText={(ratingValue) => `${ratingValue} out of 5 stars`}
                max={5}
                name="rating"
                onChange={(_, nextValue) => onChange(nextValue)}
                size="large"
                sx={{ color: 'secondary.main', mt: 0.75 }}
                value={value ?? null}
            />
        </FormControl>
    );
}

export default ExperimentRatingField;
