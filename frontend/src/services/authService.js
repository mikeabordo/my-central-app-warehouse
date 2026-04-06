/**
 * Authentication Service
 *
 * Handles login, logout, registration, and session management.
 * Communicates with the backend /api/v1/auth/* endpoints.
 */

import api from './api';

const AUTH_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
};

const authService = {
    /**
     * Login with ID Number and password.
     *
     * @param {string} idnumber - The user's ID number
     * @param {string} password - The user's password
     * @returns {Promise<object>} { status, message, data: { user } }
     */
    async login(idnumber, password) {
        // Call backend API
        const response = await api.post('/auth/login', {
            idnumber,
            password,
        });

        // Store auth data in localStorage on success
        if (response.status && response.data) {
            if (response.data.token) {
                localStorage.setItem(AUTH_KEYS.TOKEN, response.data.token);
            }
            if (response.data.user) {
                localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(response.data.user));
            }
        }

        return response;
    },

    /**
     * Logout the current user.
     */
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch {
            // Even if the API call fails, clear local data
        } finally {
            localStorage.removeItem(AUTH_KEYS.TOKEN);
            localStorage.removeItem(AUTH_KEYS.USER);
        }
    },

    /**
     * Get the currently authenticated user profile.
     *
     * @returns {Promise<object>} User data
     */
    async getProfile() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Check if the user is currently logged in.
     *
     * @returns {boolean}
     */
    isLoggedIn() {
        return !!localStorage.getItem(AUTH_KEYS.TOKEN) || !!localStorage.getItem(AUTH_KEYS.USER);
    },

    /**
     * Get the stored user data.
     *
     * @returns {object|null}
     */
    getStoredUser() {
        const user = localStorage.getItem(AUTH_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Get the stored auth token.
     *
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(AUTH_KEYS.TOKEN);
    },
};

export default authService;
