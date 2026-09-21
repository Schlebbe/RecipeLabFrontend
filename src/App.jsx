import "./App.css";
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
    return (
        <>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
