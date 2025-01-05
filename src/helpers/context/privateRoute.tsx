import { ReactNode  } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authProvider';
import { getTokenData } from '../utility/tokenData';

interface PrivateRouteProps {
	element: ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
	const { isLoading, isAuthenticated } = useAuth();
    var isActive;
    
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/signIn" replace />;
    } else {
        isActive = getTokenData().is_activated;
    }
        
    if (!isActive) {
        return <Navigate to="/profile" replace />;
    }

	return <>{element}</>;
};

export default PrivateRoute;
