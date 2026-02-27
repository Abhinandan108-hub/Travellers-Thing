/**
 * Auth Context
 * Provides authentication state to the entire app
 */

import React, { createContext, ReactNode } from 'react';
import { useAuth, UseAuth } from '../hooks/useAuth';

/**
 * Auth context type
 */
export const AuthContext = createContext<UseAuth | undefined>(undefined);

/**
 * Auth Provider component
 */
export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Must be called within AuthProvider
 */
export function useAuthContext(): UseAuth {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
