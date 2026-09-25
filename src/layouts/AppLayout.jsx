import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

function NavigationButton({ children, to }) {
    const { pathname } = useLocation();
    const isActive = pathname === to;

    return (
        <Button
            aria-current={isActive ? 'page' : undefined}
            color="inherit"
            component={RouterLink}
            size="small"
            sx={isActive ? {
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.28)',
                },
            } : undefined}
            to={to}
        >
            {children}
        </Button>
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
        <>
            <AppBar position="static">
                <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 120 }}>
                        <Typography
                            component={RouterLink}
                            sx={{
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                            to="/overview"
                            variant="h6"
                        >
                            RecipeLab
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ display: { sm: 'flex', xs: 'none' } }}
                    >
                        <NavigationButton to="/overview">
                            Overview
                        </NavigationButton>
                        <NavigationButton to="/recipes">
                            Recipes
                        </NavigationButton>
                        <NavigationButton to="/ingredients">
                            Ingredients
                        </NavigationButton>
                        <Button
                            aria-busy={isLoggingOut}
                            color="inherit"
                            disabled={isLoggingOut}
                            onClick={handleLogout}
                            size="small"
                        >
                            {isLoggingOut ? 'Logging out...' : 'Log out'}
                        </Button>
                    </Stack>

                    <Button
                        aria-controls={isMenuOpen ? 'app-navigation-menu' : undefined}
                        aria-expanded={isMenuOpen ? 'true' : undefined}
                        aria-haspopup="menu"
                        color="inherit"
                        onClick={handleOpenMenu}
                        size="small"
                        sx={{ display: { sm: 'none', xs: 'inline-flex' } }}
                    >
                        Menu
                    </Button>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={menuAnchorEl}
                id="app-navigation-menu"
                onClose={handleCloseMenu}
                open={isMenuOpen}
            >
                <MenuItem
                    aria-current={pathname === '/overview' ? 'page' : undefined}
                    component={RouterLink}
                    onClick={handleCloseMenu}
                    selected={pathname === '/overview'}
                    to="/overview"
                >
                    Overview
                </MenuItem>
                <MenuItem
                    aria-current={pathname === '/recipes' ? 'page' : undefined}
                    component={RouterLink}
                    onClick={handleCloseMenu}
                    selected={pathname === '/recipes'}
                    to="/recipes"
                >
                    Recipes
                </MenuItem>
                <MenuItem
                    aria-current={pathname === '/ingredients' ? 'page' : undefined}
                    component={RouterLink}
                    onClick={handleCloseMenu}
                    selected={pathname === '/ingredients'}
                    to="/ingredients"
                >
                    Ingredients
                </MenuItem>
                <MenuItem
                    aria-busy={isLoggingOut}
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                >
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                </MenuItem>
            </Menu>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Box component="main" sx={{ py: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}

export default AppLayout;
