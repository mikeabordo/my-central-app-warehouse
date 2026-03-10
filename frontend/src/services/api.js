/**
 * Base API Service
 *
 * Centralized HTTP client using native fetch.
 * All API calls go through this module for consistent
 * error handling, headers, and base URL management.
 */

const API_BASE_URL = process.env.VUE_APP_API_URL || '/api';

/**
 * Make an HTTP request to the API.
 *
 * @param {string} endpoint - API endpoint (e.g. '/auth/login')
 * @param {object} options  - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // Attach auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    // Convert body to JSON string if it's an object
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'An error occurred');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        // Network error or JSON parse error
        if (!error.status) {
            error.message = 'Unable to connect to the server. Please check your connection.';
        }
        throw error;
    }
}

/** Shorthand GET */
function get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
}

/** Shorthand POST */
function post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'POST', body });
}

/** Shorthand PUT */
function put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'PUT', body });
}

/** Shorthand DELETE */
function del(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
}

export default { get, post, put, del, request };
