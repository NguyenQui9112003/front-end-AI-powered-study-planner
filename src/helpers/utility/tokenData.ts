import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from '@/types/jwtPayloadType.tsx';

export const getTokenData = () => {
    const token = window.localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : null;
    const accessToken = parsedToken.access_token;
    const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);
    return decodedToken;
};