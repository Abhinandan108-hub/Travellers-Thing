/**
 * Real-World Usage Examples
 * Copy-paste ready code snippets for common scenarios
 */

// ============================================================================
// EXAMPLE 1: Display Current User in Navbar
// ============================================================================

import { useAuthContext } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-xl font-bold">Travellers Thing</div>

      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700">
              Welcome, <strong>{user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

// ============================================================================
// EXAMPLE 2: Protected Dashboard Page
// ============================================================================

import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

export function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

        <div className="grid gap-4">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>

          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-semibold capitalize">{user?.role || 'User'}</p>
          </div>

          <div>
            <p className="text-gray-600">User ID</p>
            <p className="font-semibold text-sm">{user?._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Fetch and Display Data from Protected Endpoint
// ============================================================================

import { useEffect, useState } from 'react';
import { apiRequest, User } from '@/services/api';

interface Destination {
  _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
}

export function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiRequest<Destination[]>('/api/destinations');

        if (response.success && response.data) {
          setDestinations(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) return <div>Loading destinations...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {destinations.map(dest => (
        <div key={dest._id} className="border rounded overflow-hidden shadow">
          <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-lg">{dest.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{dest.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-500">★ {dest.rating}</span>
              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Create/Submit Form with Authentication
// ============================================================================

import { useState } from 'react';
import { apiRequest } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';

export function BookingForm() {
  const { isAuthenticated } = useAuthContext();
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    guests: 1,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <p>Please <a href="/login" className="text-blue-500 underline">login</a> to make a booking</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(formData),
        // Token is auto-injected by api.ts!
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Booking created successfully!' });
        setFormData({ destination: '', date: '', guests: 1 });
      } else {
        setMessage({ type: 'error', text: response.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Booking failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">New Booking</h2>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-2">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          disabled={loading}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={loading}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Number of Guests</label>
        <input
          type="number"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          disabled={loading}
          min="1"
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Booking'}
      </button>
    </form>
  );
}

// ============================================================================
// EXAMPLE 5: Check Authentication & Redirect
// ============================================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

export function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-gray-100 p-6 rounded">
        <img
          src={user?.avatar || 'https://via.placeholder.com/100'}
          alt={user?.name}
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-500 mt-2">ID: {user?._id}</p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Handle Token Expiry & Auto-Logout
// ============================================================================

import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';

export function AutoLogoutOnTokenExpiry() {
  const { logout, getToken } = useAuthContext();

  useEffect(() => {
    // Check token validity every minute
    const interval = setInterval(() => {
      const token = getToken?.();

      if (!token) {
        logout();
        return;
      }

      // Decode JWT and check expiry (basic example)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds

        if (Date.now() >= expiryTime) {
          console.warn('Token expired, logging out...');
          logout();
        }
      } catch (error) {
        console.error('Token decode error:', error);
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [logout, getToken]);

  return null; // This is a hook component, doesn't render anything
}

// Usage: Add to App.tsx or main layout
// <AutoLogoutOnTokenExpiry />

// ============================================================================
// EXAMPLE 7: Custom Hook for API Calls
// ============================================================================

import { useState, useCallback } from 'react';
import { apiRequest, ApiResponse } from '@/services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = useCallback(
    async (endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
      setState({ data: null, loading: true, error: null });

      const response = await apiRequest<T>(endpoint, options);

      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: response.message });
      }

      return response;
    },
    []
  );

  return { ...state, callApi };
}

// Usage Example:
// const { data, loading, error, callApi } = useApi<BlogPost[]>();
// useEffect(() => {
//   callApi('/api/blogs');
// }, [callApi]);

// ============================================================================
// EXAMPLE 8: Handle Different User Roles
// ============================================================================

import { useAuthContext } from '@/context/AuthContext';

export function AdminPanel() {
  const { user } = useAuthContext();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      {/* Admin content here */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Form with Real-Time Validation
// ============================================================================

import { useState, useCallback } from 'react';

export function ValidatedForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = useCallback((value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setError('Email is required');
    } else if (!emailRegex.test(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  return (
    <div className="max-w-md">
      <input
        type="email"
        value={email}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Enter email"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: API Call with URL Parameters
// ============================================================================

import { useEffect, useState } from 'react';
import { apiRequest } from '@/services/api';

export function UserDetailsPage({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await apiRequest(`/api/users/${userId}`);

      if (response.success) {
        setUser(response.data);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return <div>{/* Display user data */}</div>;
}

// ============================================================================
// Copy-Paste Summary
// ============================================================================

/*
USE THESE COMPONENTS/HOOKS:

1. useAuthContext()
   - Get: user, token, isAuthenticated, isLoading, error
   - Call: register, login, logout, clearError, fetchCurrentUser

2. apiRequest(endpoint, options)
   - Generic API call with auto-token injection
   - Returns: ApiResponse<T> with success, message, data

3. useApi<T>()
   - Custom hook for data fetching
   - Returns: { data, loading, error, callApi }

4. ProtectedRoute
   - Wrap routes that need authentication
   - Auto-redirects to /login

5. RegisterForm / LoginForm
   - Pre-built forms, just use as <RegisterForm />
   - Handles validation, loading, errors

KEY IMPORTS:
import { useAuthContext } from '@/context/AuthContext';
import { apiRequest, getToken, getStoredUser } from '@/services/api';
import { useApi } from '@/hooks/useApi'; // If you create it
import { ProtectedRoute } from '@/components/ProtectedRoute';
*/
