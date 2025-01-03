import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authProvider';

interface PrivateRouteProps {
    element: ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { isAuthenticated } = useAuth();
    const token = window.localStorage.getItem('token');
    if (!isAuthenticated && !token) {
        return <Navigate to="/signIn" replace />;
    }
    return <>{element}</>;
};

export default PrivateRoute;
