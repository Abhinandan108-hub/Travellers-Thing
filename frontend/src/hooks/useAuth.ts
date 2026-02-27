/**
 * useAuth Hook
 * Custom hook for managing authentication state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getMe as apiGetMe,
  getStoredUser,
  getToken,
  User,
  RegisterPayload,
  LoginPayload,
  ApiResponse,
  AuthData,
} from '../services/api';

export interface UseAuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthActions {
  register: (payload: RegisterPayload) => Promise<boolean>;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export type UseAuth = UseAuthState & UseAuthActions;

/**
 * Hook for authentication state and operations
 */
export function useAuth(): UseAuth {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register function
  const register = useCallback(async (payload: RegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: ApiResponse<AuthData> = await apiRegister(payload);

      if (response.success && response.data) {
        setUser({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          avatar: response.data.avatar,
        });
        setToken(response.data.token);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: ApiResponse<AuthData> = await apiLogin(payload);

      if (response.success && response.data) {
        setUser({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          avatar: response.data.avatar,
        });
        setToken(response.data.token);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  // Fetch current user (for auth check)
  const fetchCurrentUser = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await apiGetMe();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check auth on mount
  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, []);

  return {
    // State
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,

    // Actions
    register,
    login,
    logout,
    fetchCurrentUser,
    clearError,
  };
}
