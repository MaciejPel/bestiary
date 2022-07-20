import axios from 'axios';
const API_URL = '/api/users/';

const register = async (userData: any) => {
	const response = await axios.post(API_URL, userData);
	return response.data;
};

const login = async (userData: any) => {
	const response = await axios.post(API_URL + 'login', userData);

	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data));
	}

	return response.data;
};

const me = async (token: string) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	const response = await axios.post(API_URL + 'me', {}, config);
	return response.data;
};

const logout = async () => {
	localStorage.removeItem('user');
};

const authService = {
	register,
	login,
	logout,
	me,
};

export default authService;
