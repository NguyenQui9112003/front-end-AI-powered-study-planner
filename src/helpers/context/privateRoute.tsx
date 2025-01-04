import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getTokenData } from '../utility/tokenData';

interface PrivateRouteProps {
    element: ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
    var isActive = getTokenData().is_activated;

    if (!isActive) {
        return <Navigate to="/profile" replace />;
    }

    return <>{element}</>;
};

export default PrivateRoute;
