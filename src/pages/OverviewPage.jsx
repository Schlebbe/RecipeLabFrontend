import { useEffect, useState } from 'react';
import { PageContainer } from '../components/PageLayout';
import RecipeOverview from '../components/RecipeOverview';
import { getRecipeStatistics } from '../services/recipeService';

function OverviewPage() {
    const [statistics, setStatistics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadStatistics() {
            try {
                const recipeStatistics = await getRecipeStatistics();

                if (!isMounted) {
                    return;
                }

                setStatistics(recipeStatistics);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(error instanceof Error ? error.message : 'Unable to load the overview.');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadStatistics();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <PageContainer>
            <RecipeOverview
                errorMessage={errorMessage}
                isLoading={isLoading}
                statistics={statistics}
            />
        </PageContainer>
    );
}

export default OverviewPage;
