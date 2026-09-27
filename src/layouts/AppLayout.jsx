import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import { Link as RouterLink, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const navigationItems = [
    { icon: DashboardOutlinedIcon, label: 'Overview', to: '/overview' },
    { icon: MenuBookOutlinedIcon, label: 'Recipes', to: '/recipes' },
    { icon: SpaOutlinedIcon, label: 'Ingredients', to: '/ingredients' },
];

function NavigationButton({ icon: Icon, label, to }) {
    const { pathname } = useLocation();
    const isActive = pathname === to;

    return (
        <Button
            aria-current={isActive ? 'page' : undefined}
            component={RouterLink}
            startIcon={<Icon fontSize="small" />}
            sx={{
                color: isActive ? 'primary.dark' : 'text.secondary',
                minHeight: 46,
                position: 'relative',
                px: 2,
                '&::after': isActive ? {
                    backgroundColor: 'primary.main',
                    borderRadius: 1,
                    bottom: 4,
                    content: '""',
                    height: 2,
                    left: 16,
                    position: 'absolute',
                    right: 16,
                } : undefined,
                '&:hover': {
                    backgroundColor: isActive ? 'primary.light' : 'action.hover',
                    color: 'text.primary',
                },
                ...(isActive && {
                    backgroundColor: 'primary.light',
                }),
            }}
            to={to}
        >
            {label}
        </Button>
    );
}

function MobileNavigationItem({ icon: Icon, label, onClick, selected, to }) {
    return (
        <MenuItem
            aria-current={selected ? 'page' : undefined}
            component={RouterLink}
            onClick={onClick}
            selected={selected}
            to={to}
        >
            <ListItemIcon>
                <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
        </MenuItem>
    );
}

function AppLayout() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const isMenuOpen = Boolean(menuAnchorEl);

    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleLogout = async () => {
        handleCloseMenu();
        setErrorMessage('');
        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to log out.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar component="header" position="static">
                <Toolbar
                    component="nav"
                    sx={{
                        gap: { md: 4, xs: 1 },
                        justifyContent: 'space-between',
                        minHeight: { md: 80, sm: 72, xs: 68 },
                        mx: 'auto',
                        px: { lg: 5, md: 4, sm: 3, xs: 2 },
                        width: '100%',
                    }}
                >
                    <Box
                        aria-label="RecipeLab home"
                        component={RouterLink}
                        sx={{
                            alignItems: 'center',
                            color: 'text.primary',
                            display: 'inline-flex',
                            flexShrink: 0,
                            gap: 1,
                            textDecoration: 'none',
                        }}
                        to="/overview"
                    >
                        <SpaOutlinedIcon sx={{ color: 'primary.main', fontSize: { sm: 30, xs: 27 } }} />
                        <Typography
                            component="span"
                            sx={{
                                fontFamily: 'Georgia, "Times New Roman", serif',
                                fontSize: { sm: '1.8rem', xs: '1.45rem' },
                                fontWeight: 700,
                                letterSpacing: '-0.05em',
                                lineHeight: 1,
                            }}
                        >
                            Recipe<Box component="span" sx={{ color: 'primary.main' }}>Lab</Box>
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                            alignItems: 'center',
                            display: { md: 'flex', xs: 'none' },
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        {navigationItems.map((item) => (
                            <NavigationButton key={item.to} {...item} />
                        ))}
                    </Stack>

                    <Button
                        aria-busy={isLoggingOut}
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        startIcon={<LogoutRoundedIcon fontSize="small" />}
                        sx={{
                            color: 'text.secondary',
                            display: { md: 'inline-flex', xs: 'none' },
                            flexShrink: 0,
                            minHeight: 46,
                        }}
                    >
                        {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </Button>

                    <IconButton
                        aria-controls={isMenuOpen ? 'app-navigation-menu' : undefined}
                        aria-expanded={isMenuOpen ? 'true' : undefined}
                        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-haspopup="menu"
                        onClick={isMenuOpen ? handleCloseMenu : handleOpenMenu}
                        sx={{ display: { md: 'none', xs: 'inline-flex' } }}
                    >
                        {isMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={menuAnchorEl}
                id="app-navigation-menu"
                onClose={handleCloseMenu}
                open={isMenuOpen}
                slotProps={{
                    paper: {
                        sx: { minWidth: 220 },
                    },
                }}
            >
                {navigationItems.map((item) => (
                    <MobileNavigationItem
                        key={item.to}
                        {...item}
                        onClick={handleCloseMenu}
                        selected={pathname === item.to}
                    />
                ))}
                <Divider sx={{ my: 1 }} />
                <MenuItem
                    aria-busy={isLoggingOut}
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                >
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{isLoggingOut ? 'Logging out...' : 'Log out'}</ListItemText>
                </MenuItem>
            </Menu>

            <Box component="main">
                {errorMessage && (
                    <Container maxWidth="lg" sx={{ pt: 2, px: { sm: 3, xs: 2 } }}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Container>
                )}
                <Outlet />
            </Box>
        </Box>
    );
}

export default AppLayout;
