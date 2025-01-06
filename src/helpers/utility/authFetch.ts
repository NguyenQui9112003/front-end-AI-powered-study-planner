const refreshToken = async (refresh_token: string) => {
	if (!refresh_token) {
		return null;
	}

	try {
		const response = await fetch(
			'http://https://be-ai-study-planner.onrender.com/auth/refresh-token',
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

export const authFetch = async (url: string, request: RequestInit) => {
	const token = window.localStorage.getItem('token');

	if (!token) {
		return null;
	}

	const parsedToken = token ? JSON.parse(token) : null;
	let accessToken = parsedToken.access_token;
	const refresh_token = parsedToken.refresh_token;

	request.headers = {
		...request.headers,
		Authorization: `Bearer ${accessToken}`,
	};

	console.log("request: ", request)

	try {
		let response = await fetch(url, request);

		if (!response.ok && response.status === 419) {
			accessToken = await refreshToken(refresh_token);

			if (!accessToken) {
				return null;
			}

			request.headers = {
				...request.headers,
				Authorization: `Bearer ${accessToken}`,
			};

			response = await fetch(url, request);

			if (!response.ok) {
				return null;
			}

			return response;
		}

		return response;
	} catch (error) {
		console.error('Error fetching:', error);
		return null;
	}
};
