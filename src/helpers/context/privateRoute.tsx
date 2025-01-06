import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authProvider';
import { getTokenData } from '../utility/tokenData';

interface PrivateRouteProps {
    element: ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to="/signIn" replace />;
    }
    
    const isActive = getTokenData().is_activated;
        
    if (!isActive) {
        return <Navigate to="/profile" replace />;
    }

    return <>{element}</>;
};

export default PrivateRoute;
