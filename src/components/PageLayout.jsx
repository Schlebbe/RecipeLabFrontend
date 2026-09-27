import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function PageContainer({ children, ...props }) {
    return (
        <Container
            maxWidth="lg"
            sx={{
                px: { md: 4, sm: 3, xs: 2 },
                py: { md: 6, sm: 5, xs: 3 },
            }}
            {...props}
        >
            {children}
        </Container>
    );
}

export function PageHeader({ action, description, title }) {
    return (
        <Stack
            direction={{ sm: 'row', xs: 'column' }}
            spacing={2}
            sx={{
                alignItems: { sm: 'center', xs: 'flex-start' },
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography component="h1" variant="h1">
                    {title}
                </Typography>
                {description && (
                    <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760 }} variant="body1">
                        {description}
                    </Typography>
                )}
            </Box>
            {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        </Stack>
    );
}
