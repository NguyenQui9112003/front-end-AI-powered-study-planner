import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRefreshToken } from '../helpers/utility/refreshToken';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const refreshToken = useRefreshToken();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = window.localStorage.getItem('token');
            if (!token) {
                navigate('/signIn');
                return;
            }
            const parsedToken = token ? JSON.parse(token) : null;
            let accessToken = parsedToken.access_token;
            let refresh_token = parsedToken.refresh_token;

            try {
                let response = await fetch('http://localhost:3000/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else if (response.status === 419) {
                    accessToken = await refreshToken(refresh_token);
                    if (accessToken) {
                        response = await fetch('http://localhost:3000/auth/profile', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setUsername(data.username);
                        } else {
                            navigate('/signIn');
                        }
                    }
                } else {
                    navigate('/signIn');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/signIn');
            }
        };
        fetchProfile();
    }, []);

    return (
        <>
            {username ? <p>Username: {username}</p> : <p>Loading...</p>}
        </>
    );
};

export default ProfilePage;