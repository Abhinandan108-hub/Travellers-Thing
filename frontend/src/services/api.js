/**
 * API Service Utility
 * Handles all HTTP requests to the backend with proper error handling, token management, and typing
 */
// ============================================================================
// Configuration
// ============================================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Get stored token from localStorage
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};
/**
 * Get stored user from localStorage
 */
export const getStoredUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};
/**
 * Save token and user to localStorage
 */
export const saveAuthData = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};
/**
 * Clear auth data from localStorage
 */
export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};
/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!getToken();
};
/**
 * Core fetch wrapper with error handling and token injection
 */
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();
    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    // Add auth token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        // Parse response
        const data = await response.json();
        // Handle HTTP errors
        if (!response.ok) {
            // If unauthorized, clear auth data
            if (response.status === 401) {
                clearAuthData();
            }
            // Return error response structure
            return {
                success: false,
                message: data.message || `Error: ${response.status} ${response.statusText}`,
                data: data.data,
            };
        }
        return data;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
        console.error('API Error:', errorMessage);
        return {
            success: false,
            message: `Request failed: ${errorMessage}`,
        };
    }
}
// ============================================================================
// Auth Endpoints
// ============================================================================
/**
 * Register a new user
 */
export async function register(payload) {
    const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    // If successful, save auth data
    if (response.success && response.data?.token && response.data?.email) {
        const user = {
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            avatar: response.data.avatar,
        };
        saveAuthData(response.data.token, user);
    }
    return response;
}
/**
 * Login user
 */
export async function login(payload) {
    const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    // If successful, save auth data
    if (response.success && response.data?.token && response.data?.email) {
        const user = {
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            avatar: response.data.avatar,
        };
        saveAuthData(response.data.token, user);
    }
    return response;
}
/**
 * Get current user profile (requires auth)
 */
export async function getMe() {
    return apiCall('/api/auth/me', {
        method: 'GET',
    });
}
/**
 * Logout user
 */
export async function logout() {
    clearAuthData();
}
// ============================================================================
// Destination Endpoints (Examples)
// ============================================================================
export async function getDestinations() {
    return apiCall('/api/destinations', { method: 'GET' });
}
export async function getDestination(id) {
    return apiCall(`/api/destinations/${id}`, { method: 'GET' });
}
// ============================================================================
// Package Endpoints (Examples)
// ============================================================================
export async function getPackages() {
    return apiCall('/api/packages', { method: 'GET' });
}
export async function getPackage(id) {
    return apiCall(`/api/packages/${id}`, { method: 'GET' });
}
// ============================================================================
// Generic API Call (for any custom endpoint)
// ============================================================================
/**
 * Generic API call for flexibility
 */
export async function apiRequest(endpoint, options) {
    return apiCall(endpoint, options);
}
export default {
    // Auth
    register,
    login,
    getMe,
    logout,
    getToken,
    getStoredUser,
    isAuthenticated,
    clearAuthData,
    // Destinations & Packages
    getDestinations,
    getDestination,
    getPackages,
    getPackage,
    // Generic
    apiRequest,
};
