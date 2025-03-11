
const API_URL =  'http://127.0.0.1:8000' ;

export const apiClient = {
    fetch: async (endpoint, options = {}) => {
        const url = `${API_URL}${endpoint}`;

        // Get token from localStorage if available
        const token = localStorage.getItem('accessToken');

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            // Handle unauthorized errors (could add token refresh logic here)
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }

            return response;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
};