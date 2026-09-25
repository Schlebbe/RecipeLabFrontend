import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';

function NotFoundPage() {
    return (
        <Container maxWidth="sm">
            <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Typography component="h1" variant="h2">
                    404
                </Typography>
                <Typography component="p" variant="h5">
                    The page you are looking for could not be found.
                </Typography>
                <Button component={RouterLink} to="/" variant="contained">
                    Return to RecipeLab
                </Button>
            </Stack>
        </Container>
    );
}

export default NotFoundPage;
