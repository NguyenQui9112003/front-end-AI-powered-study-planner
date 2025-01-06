import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextProps {
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('Error with AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        window.localStorage.setItem('token', JSON.stringify(token));
        setIsAuthenticated(true);
    };

	const logout = () => {
		window.localStorage.removeItem('token');
		setIsAuthenticated(false);
	};

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
