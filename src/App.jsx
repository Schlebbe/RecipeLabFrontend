import "./App.css";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

function App() {
    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg">
                <Typography component="h1" variant="h3">
                    RecipeLab
                </Typography>
            </Container>
        </>
    );
}

export default App;
