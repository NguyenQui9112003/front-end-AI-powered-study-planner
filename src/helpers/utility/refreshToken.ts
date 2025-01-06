import { useNavigate } from 'react-router-dom';

export const useRefreshToken = () => {
    const navigate = useNavigate();

    const refreshToken = async (refresh_token: string) => {
        if (!refresh_token) {
            navigate('/signIn');
            return null;
        }

        try {
            const response = await fetch('http://https://be-ai-study-planner.onrender.com/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token })
            });

            if (response.ok) {
                const data = await response.json();
                window.localStorage.setItem('token', JSON.stringify(data));
                return data.access_token;
            } else {
                navigate('/signIn');
                return null;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            navigate('/signIn');
            return null;
        }
    };

    return refreshToken;
};

