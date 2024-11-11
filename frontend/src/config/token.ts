import axios from 'axios';
import Cookies from 'js-cookie';
import apiConfig from './api';

const refreshToken = async () => {
    const refreshToken = Cookies.get('refresh_token'); // Retrieve the refresh token from cookies

    if (!refreshToken) {
        throw new Error('No refresh token found');
    }

    try {
        const response = await axios.post(apiConfig.user.refreshToken, { refresh_token: refreshToken });
        const { access_token } = response.data; // Assuming the new token is returned in this format
        Cookies.set('access_token', access_token); // Update the access token in cookies
    } catch (error: any) {
        throw new Error('Error refreshing token: ' + error.message);
    }
};

export const fetchUserProfile = async (): Promise<any> => {
    let token = Cookies.get('access_token'); // Retrieve the token from cookies

    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get(apiConfig.user.getUserFromToken, {
            headers: {
                Authorization: `Bearer ${token}`, // Set the Authorization header
            },
        });

        return response.data; // Return the user profile data
    } catch (error: any) {
        if (error.response && error.response.status === 401) { // Check for unauthorized error
            await refreshToken(); // Attempt to refresh the token
            return fetchUserProfile(); // Retry fetching the user profile
        }
        throw new Error('Error fetching user profile: ' + error.message);
    }
};