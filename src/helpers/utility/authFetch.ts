import { NavigateFunction } from 'react-router-dom';

const refreshToken = async (refresh_token: string) => {
	if (!refresh_token) {
		return null;
	}

	try {
		const response = await fetch(
			'http://localhost:3000/auth/refresh-token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh_token }),
			}
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		window.localStorage.setItem('token', JSON.stringify(data));
		return data.access_token;
	} catch (error) {
		console.error('Error refreshing token:', error);
		return null;
	}
};

export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthError';
	}
}

export const authFetch = async (
	url: string,
	request: RequestInit,
	navigate?: NavigateFunction
) => {
	const token = window.localStorage.getItem('token');

	const toLogin = () => {
		if (navigate) navigate('/signIn');
	};

	if (!token) {
		toLogin();
		throw new AuthError('No token found');
	}

	const parsedToken = token ? JSON.parse(token) : null;
	let accessToken = parsedToken.access_token;
	const refresh_token = parsedToken.refresh_token;

	request.headers = {
		...request.headers,
		Authorization: `Bearer ${accessToken}`,
	};

	try {
		let response = await fetch(url, request);

		if (!response.ok && response.status === 419) {
			accessToken = await refreshToken(refresh_token);

			if (!accessToken) {
				toLogin();
				throw new AuthError('Refresh token invalid');
			}

			request.headers = {
				...request.headers,
				Authorization: `Bearer ${accessToken}`,
			};

			response = await fetch(url, request);

			if (!response.ok) {
				throw new Error('Request fail: ' + response);
			}

			return response;
		}

		return response;
	} catch (error) {
		console.error('Error fetching:', error);
		throw new AuthError('Unknown error: ' + error);
	}
};
