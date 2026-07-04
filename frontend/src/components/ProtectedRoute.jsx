/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 */
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
/**
 * Protects routes that require authentication
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuthContext();
    if (isLoading) {
        return (<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>);
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    return <>{children}</>;
}
