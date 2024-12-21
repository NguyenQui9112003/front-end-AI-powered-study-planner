import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../helpers/context/authProvider';
import app from '../../../config/firebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const useGoogleLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const logInGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            let response = await fetch('http://localhost:3000/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            const token = await response.json();
            login(token);
            navigate('/home');
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return logInGoogle;
};
