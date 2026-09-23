import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, Outlet } from 'react-router';

function AppLayout() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        component="div"
                        sx={{ flexGrow: 1 }}
                        variant="h6"
                    >
                        RecipeLab
                    </Typography>

                    <Button
                        color="inherit"
                        component={RouterLink}
                        size="small"
                        to="/recipes"
                    >
                        Recipes
                    </Button>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ py: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}

export default AppLayout;
