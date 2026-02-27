/**
 * API Service Utility
 * Handles all HTTP requests to the backend with proper error handling, token management, and typing
 */

// ============================================================================
// Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  stack?: string;
}

export interface AuthData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}

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
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Save token and user to localStorage
 */
export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ============================================================================
// Core Fetch Function
// ============================================================================

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Core fetch wrapper with error handling and token injection
 */
async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  // Default headers
  const headers: Record<string, string> = {
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
    const data: ApiResponse<T> = await response.json();

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
  } catch (error) {
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
export async function register(
  payload: RegisterPayload
): Promise<ApiResponse<AuthData>> {
  const response = await apiCall<AuthData>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // If successful, save auth data
  if (response.success && response.data?.token && response.data?.email) {
    const user: User = {
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
export async function login(
  payload: LoginPayload
): Promise<ApiResponse<AuthData>> {
  const response = await apiCall<AuthData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // If successful, save auth data
  if (response.success && response.data?.token && response.data?.email) {
    const user: User = {
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
export async function getMe(): Promise<ApiResponse<User>> {
  return apiCall<User>('/api/auth/me', {
    method: 'GET',
  });
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  clearAuthData();
}

// ============================================================================
// Destination Endpoints (Examples)
// ============================================================================

export async function getDestinations(): Promise<ApiResponse<any[]>> {
  return apiCall('/api/destinations', { method: 'GET' });
}

export async function getDestination(id: string): Promise<ApiResponse<any>> {
  return apiCall(`/api/destinations/${id}`, { method: 'GET' });
}

// ============================================================================
// Package Endpoints (Examples)
// ============================================================================

export async function getPackages(): Promise<ApiResponse<any[]>> {
  return apiCall('/api/packages', { method: 'GET' });
}

export async function getPackage(id: string): Promise<ApiResponse<any>> {
  return apiCall(`/api/packages/${id}`, { method: 'GET' });
}

// ============================================================================
// Generic API Call (for any custom endpoint)
// ============================================================================

/**
 * Generic API call for flexibility
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options?: FetchOptions
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, options);
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
