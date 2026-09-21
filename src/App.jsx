import "./App.css";
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
    return (
        <>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
