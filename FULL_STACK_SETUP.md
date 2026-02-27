# Full-Stack MERN Connection Setup - Complete Guide

## Overview

This document explains the complete setup for connecting your React + Vite frontend to your Node.js + Express backend with proper authentication, error handling, and state management.

---

## Architecture Overview

```
Frontend (React + Vite)
├── Components (RegisterForm, LoginForm, ProtectedRoute)
├── Pages (RegisterPage, LoginPage)
├── Context (AuthContext for global state)
├── Hooks (useAuth for auth logic)
├── Services (api.ts for all HTTP requests)
└── localStorage (stores token and user data)
        ↓
API Requests (fetch with Bearer token)
        ↓
Backend (Node + Express + TypeScript)
├── Routes (POST /api/auth/register, /api/auth/login)
├── Controllers (handle business logic)
├── Models (MongoDB schemas)
└── Middleware (auth, error handling, CORS)
```

---

## Step-by-Step Implementation

### 1. Backend CORS Configuration ✅

**File:** `backend/src/app.ts`

```typescript
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);
```

**Why this works:**
- ✅ Accepts requests from `http://localhost:5173` (Vite default)
- ✅ Allows Authorization header for JWT tokens
- ✅ Supports credentials (cookies if needed)
- ✅ Flexible for production URLs via `CLIENT_URL` env var

**Backend .env:**
```env
CLIENT_URL=http://localhost:5173
```

---

### 2. Frontend API Service ✅

**File:** `frontend/src/services/api.ts`

This is the core utility that handles all communication with your backend:

```typescript
// Auto-injects token in Authorization header
const response = await apiRegister({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

if (response.success) {
  // Token automatically saved to localStorage
  // User data automatically saved to localStorage
}
```

**Key Features:**
- ✅ Centralized API client with fetch
- ✅ Automatic token injection in headers
- ✅ localStorage token management
- ✅ Error handling and user feedback
- ✅ Type-safe responses with TypeScript
- ✅ Generic `apiRequest()` for any endpoint

**Frontend .env.local:**
```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Auth Hook for Component Logic ✅

**File:** `frontend/src/hooks/useAuth.ts`

```typescript
const { 
  user,           // Current user object
  token,          // JWT token
  isAuthenticated,// Boolean
  isLoading,      // During request
  error,          // Error message
  register,       // Function to register
  login,          // Function to login
  logout,         // Function to logout
} = useAuth();
```

**Usage Example:**
```typescript
const handleRegister = async () => {
  const success = await register({
    name, email, password, phone
  });
  if (success) {
    // Redirect to dashboard
  }
};
```

---

### 4. Auth Context Provider ✅

**File:** `frontend/src/context/AuthContext.tsx`

Wraps your entire app to provide auth state globally:

```typescript
// In App.tsx
<AuthProvider>
  {/* All your routes */}
</AuthProvider>

// In any component
const { user, isAuthenticated } = useAuthContext();
```

**Why Context?**
- ✅ No prop drilling
- ✅ Global auth state accessible anywhere
- ✅ Persistent across page navigation
- ✅ Auto-loads from localStorage on mount

---

### 5. Register Form Component ✅

**File:** `frontend/src/components/RegisterForm.tsx`

Complete form with:
- ✅ Form validation (name, email, password)
- ✅ Loading state during submission
- ✅ Error handling and display
- ✅ Success feedback
- ✅ Accessibility features (aria labels)
- ✅ Password confirmation

**Token Storage Flow:**
```
User fills form → validate → POST /api/auth/register
                                   ↓
Backend validates → creates user → generates JWT token
                                   ↓
Frontend receives { token, user data }
                                   ↓
API service saves token to localStorage
                                   ↓
useAuth hook updates state
                                   ↓
Component shows success message
```

---

### 6. Login Form Component ✅

**File:** `frontend/src/components/LoginForm.tsx`

Similar to register but with fewer fields:
- ✅ Email + Password
- ✅ Same loading/error/success handling
- ✅ Auto-saves token to localStorage
- ✅ Ready for redirect to dashboard

---

### 7. Register & Login Pages ✅

**Files:**
- `frontend/src/pages/RegisterPage.tsx`
- `frontend/src/pages/LoginPage.tsx`

Wrapper pages with styling and layout

---

### 8. Protected Routes ✅

**File:** `frontend/src/components/ProtectedRoute.tsx`

```typescript
// In routes
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />

// If not authenticated → redirects to /login
```

---

### 9. App Setup ✅

**File:** `frontend/src/App.tsx`

```typescript
<QueryClientProvider client={queryClient}>
  <AuthProvider>  {/* Wraps entire app */}
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>
```

---

## Token Management

### How Tokens are Stored

```typescript
// Saved automatically on successful login/register
localStorage.setItem('auth_token', 'eyJhbGci...')
localStorage.setItem('auth_user', JSON.stringify({...}))

// Used automatically in all requests
// Every request includes: Authorization: Bearer eyJhbGci...
```

### How to Access Token in Components

```typescript
import { useAuthContext } from '@/context/AuthContext';
import { getToken, getStoredUser } from '@/services/api';

export function MyComponent() {
  // Option 1: Use context
  const { token, user } = useAuthContext();

  // Option 2: Use direct getters
  const currentToken = getToken();
  const currentUser = getStoredUser();

  return <div>{user?.email}</div>;
}
```

### Clear Token on Logout

```typescript
const { logout } = useAuthContext();

const handleLogout = () => {
  logout(); // Clears localStorage + state
};
```

---

## Error Handling

### Backend Errors → Frontend Display

**Backend example:**
```typescript
// authController.ts
if (userExists) {
  return res.status(400).json({ 
    success: false, 
    message: 'User already exists with this email' 
  });
}
```

**Frontend auto-displays:**
```typescript
{authError && (
  <Alert className="bg-red-50">
    <AlertDescription>{authError}</AlertDescription>
  </Alert>
)}
```

### Common Error Scenarios

| Scenario | Status | Handling |
|----------|--------|----------|
| Email already exists | 400 | Display "User already exists" |
| Invalid credentials | 401 | Display "Invalid email/password" |
| Token expired | 401 | Auto-clears token + redirect to login |
| Network error | - | Display "Request failed" |
| Missing fields | 400 | Display field-specific errors |

---

## Loading States

### During Form Submission

```typescript
<Button disabled={isLoading}>
  {isLoading ? 'Creating Account...' : 'Create Account'}
</Button>

<Input disabled={isLoading} />
```

### During Auth Check

```typescript
const { isLoading } = useAuthContext();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

---

## API Endpoints Reference

### Authentication Endpoints

```typescript
// POST /api/auth/register
{
  name: string,
  email: string,
  password: string,
  phone?: string
}

Response:
{
  success: true,
  data: {
    _id: string,
    name: string,
    email: string,
    role: string,
    avatar: string,
    token: string  // ← Save this!
  }
}

---

// POST /api/auth/login
{
  email: string,
  password: string
}

Response: (same as register)

---

// GET /api/auth/me (requires Authorization header)
Headers: {
  Authorization: "Bearer jwt_token_here"
}

Response:
{
  success: true,
  data: {
    _id: string,
    name: string,
    email: string,
    role: string,
    avatar?: string,
    phone?: string
  }
}
```

---

## Usage Examples

### Complete Registration Flow

```typescript
import { RegisterForm } from '@/components/RegisterForm';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
```

### Complete Login Flow

```typescript
import { LoginForm } from '@/components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

### Using Auth in Custom Component

```typescript
import { useAuthContext } from '@/context/AuthContext';

export function Dashboard() {
  const { user, logout, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import { apiRequest, getToken } from '@/services/api';

export function BookingForm() {
  const handleSubmit = async (data) => {
    const response = await apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
      // Token is auto-injected!
    });

    if (response.success) {
      // Success
    } else {
      console.error(response.message);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Checking Authentication Status

```typescript
import { isAuthenticated, getStoredUser } from '@/services/api';

export function Navbar() {
  const loggedIn = isAuthenticated();
  const user = getStoredUser();

  return (
    <nav>
      {loggedIn ? (
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <div>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      )}
    </nav>
  );
}
```

---

## Running the Application

### Terminal 1: Start Backend

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Test the Flow

1. Open `http://localhost:5173`
2. Click "Register" or navigate to `/register`
3. Fill out form → Submit
4. Token auto-saves to localStorage
5. User state updates globally
6. Redirect to dashboard or home

---

## Security Best Practices Implemented

✅ **Token Storage**: Saved in localStorage (accessible over HTTPS)  
✅ **Token Injection**: Auto-added to Authorization header  
✅ **CORS Configuration**: Restricts requests to trusted origins  
✅ **Error Handling**: Doesn't expose sensitive info  
✅ **Validation**: Client-side + server-side validation  
✅ **Password**: Never logged, never sent in logs or errors  
✅ **Token Expiry**: Handle 401 by auto-logout  

---

## File Structure Summary

```
frontend/src/
├── services/
│   └── api.ts                    # Core API client with token management
├── hooks/
│   └── useAuth.ts                # Auth state & operations hook
├── context/
│   └── AuthContext.tsx           # Global auth context provider
├── components/
│   ├── RegisterForm.tsx          # Registration form with validation
│   ├── LoginForm.tsx             # Login form
│   └── ProtectedRoute.tsx        # Route protection component
├── pages/
│   ├── RegisterPage.tsx          # /register page
│   └── LoginPage.tsx             # /login page
└── App.tsx                       # Main app with routes & AuthProvider

backend/src/
├── controllers/
│   └── authController.ts         # register, login, getMe endpoints
├── routes/
│   └── authRoutes.ts             # Auth route definitions
├── models/
│   └── User.ts                   # MongoDB user schema
├── middleware/
│   ├── authMiddleware.ts         # JWT verification
│   └── errorMiddleware.ts        # Error handling
├── app.ts                        # Express app with CORS config
└── index.ts                      # Server startup
```

---

## Troubleshooting

### Issue: CORS Error in Browser

**Solution:**
1. Check `backend/src/app.ts` CORS configuration
2. Verify `CLIENT_URL` env var matches frontend URL
3. Ensure `credentials: true` is set
4. Clear browser cache and restart

### Issue: Token Not Sent in Requests

**Solution:**
1. Verify token is saved: `localStorage.getItem('auth_token')`
2. Check API service includes Authorization header
3. Verify backend accepts Bearer token format
4. Check Authorization header in Network tab (DevTools)

### Issue: 401 Unauthorized on Protected Routes

**Solution:**
1. Verify token exists in localStorage
2. Verify token hasn't expired on backend
3. Check token format: should be `Bearer <token>`
4. Manual logout: clear localStorage and re-login

### Issue: Form Submission Hangs

**Solution:**
1. Check network tab for request status
2. Verify backend is running (`npm run dev`)
3. Check for console errors in browser
4. Verify API URL in env vars

---

## Next Steps

After this setup, you can:

1. **Create Dashboard Page**: Fetch user data with `getMe()`
2. **Add Logout Button**: Use `logout()` from context
3. **Create Other Forms**: Reuse `apiRequest()` for any endpoint
4. **Add Refresh Logic**: Auto-fetch user on app startup
5. **Implement 2FA**: Add extra auth layer
6. **Add Role-Based Routes**: Extend ProtectedRoute for admin checks

---

## Production Deployment

### Backend (.env)
```env
CLIENT_URL=https://yourdomain.com
JWT_SECRET=use-a-strong-random-secret
NODE_ENV=production
```

### Frontend
```env
VITE_API_URL=https://api.yourdomain.com
```

### CORS for Production
```typescript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];
```

---

## Support

For issues, check:
1. Network tab (DevTools) for actual request/response
2. Browser Console for errors
3. Backend logs for server-side errors
4. LocalStorage contents for token validity
5. CORS headers in response

---

**Last Updated:** February 2026  
**Technologies:** React 18, Vite, TypeScript, Node.js, Express, MongoDB
