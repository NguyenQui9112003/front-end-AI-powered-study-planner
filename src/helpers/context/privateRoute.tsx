import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenData } from '../utility/tokenData';

interface PrivateRouteProps {
    element: ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
<<<<<<< HEAD
    const { isAuthenticated } = useAuth();
    const token = window.localStorage.getItem('token');
    if (!isAuthenticated && !token) {
        return <Navigate to="/signIn" replace />;
=======
    var isActive = getTokenData().is_activated;

    if (!isActive) {
        return <Navigate to="/profile" replace />;
>>>>>>> main
    }
    return <>{element}</>;
};

export default PrivateRoute;
