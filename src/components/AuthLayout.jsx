import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router';
import authBackground from '../assets/auth-background.png';

function AuthBrand() {
    return (
        <Box
            aria-label="RecipeLab home"
            component={RouterLink}
            sx={{
                alignItems: 'center',
                color: 'text.primary',
                display: 'inline-flex',
                gap: 1,
                textDecoration: 'none',
            }}
            to="/login"
        >
            <SpaOutlinedIcon sx={{ color: 'primary.main', fontSize: { sm: 32, xs: 28 } }} />
            <Box
                component="span"
                sx={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: { sm: '1.9rem', xs: '1.55rem' },
                    fontWeight: 700,
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                }}
            >
                Recipe<Box component="span" sx={{ color: 'primary.main' }}>Lab</Box>
            </Box>
        </Box>
    );
}

function DecorativeAuthVisual() {
    return (
        <Box
            aria-hidden="true"
            sx={{
                backgroundImage: `url(${authBackground})`,
                backgroundPosition: 'center right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                display: { lg: 'block', xs: 'none' },
                minHeight: '100dvh',
                width: '100%',
            }}
        />
    );
}

function AuthLayout({ children }) {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh', width: '100%' }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { lg: 'minmax(0, 1fr) minmax(0, 1fr)', xs: '1fr' },
                    minHeight: '100dvh',
                }}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: { md: 'center', xs: 'flex-start' },
                        p: { lg: 8, md: 7, sm: 5, xs: 3 },
                    }}
                >
                    <Box sx={{ maxWidth: 560, width: '100%' }}>
                        <AuthBrand />
                        <Box sx={{ mt: { lg: 10, md: 8, xs: 6 } }}>{children}</Box>
                    </Box>
                </Box>
                <DecorativeAuthVisual />
            </Box>
        </Box>
    );
}

export default AuthLayout;
