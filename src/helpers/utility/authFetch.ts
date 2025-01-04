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

export const authFetch = async (url: string, request: RequestInit) => {
	const token = window.localStorage.getItem('token');

	if (!token) {
		throw new AuthError('No token found');
	}

	const parsedToken = JSON.parse(token);
	let accessToken = parsedToken.access_token;
	const refresh_token = parsedToken.refresh_token;

	request.headers = {
		...request.headers,
		Authorization: `Bearer ${accessToken}`,
	};

	let response = await fetch(url, request);

	if (!response.ok && response.status === 419) {
		accessToken = await refreshToken(refresh_token);

		if (!accessToken) {
			throw new AuthError('No access token found');
		}

		request.headers = {
			...request.headers,
			Authorization: `Bearer ${accessToken}`,
		};

		response = await fetch(url, request);

		if (!response.ok) {
			throw new AuthError('Request failed');
		}

		return response;
	}

	return response;
};
