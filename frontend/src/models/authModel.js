class AuthModel {
    isAuthenticated = false;
    user = null;
    role = null;

    // Method to handle login
    async login(email, password) {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            this.setAuthData(data);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }l
    }

    async signup(userData) {
        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Signup failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    // Method to handle token refresh
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch('/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.ok) {
                this.logout();
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access_token);
            return data;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }

    // Method to handle logout
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        this.isAuthenticated = false;
        this.user = null;
        this.role = null;
    }

    // Store authentication data
    setAuthData(authData) {
        localStorage.setItem('accessToken', authData.access_token);
        localStorage.setItem('refreshToken', authData.refresh_token);
        localStorage.setItem('userRole', authData.role);

        this.isAuthenticated = true;
        this.role = authData.role;
    }

    // Check if user is authenticated
    checkAuth() {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');

        if (token) {
            this.isAuthenticated = true;
            this.role = role;
            return true;
        }

        return false;
    }

    // Get the auth token for API calls
    getToken() {
        return localStorage.getItem('accessToken');
    }

    // Get user role
    getRole() {
        return localStorage.getItem('userRole');
    }
}

export default new AuthModel();