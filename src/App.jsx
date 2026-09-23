import "./App.css";
import CssBaseline from '@mui/material/CssBaseline';
import { Navigate, Route, Routes } from 'react-router';
import AppLayout from './layouts/AppLayout.jsx';
import IngredientsPage from './pages/IngredientsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import RecipesPage from './pages/RecipesPage.jsx';
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
                    <Route element={<AppLayout />}>
                        <Route element={<Navigate replace to="/overview" />} index />
                        <Route path="/ingredients" element={<IngredientsPage />} />
                        <Route path="/overview" element={<OverviewPage />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
