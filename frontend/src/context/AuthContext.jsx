/**
 * Auth Context
 * Provides authentication state to the entire app
 */
import React, { createContext } from 'react';
import { useAuth } from '../hooks/useAuth';
/**
 * Auth context type
 */
export const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
/**
 * Hook to use auth context
 * Must be called within AuthProvider
 */
export function useAuthContext() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
