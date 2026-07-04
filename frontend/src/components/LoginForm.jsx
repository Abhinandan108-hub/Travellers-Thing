/**
 * LoginForm Component
 * Form for user login with proper error handling
 */
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
export function LoginForm() {
    const { login: authLogin, isLoading, error: authError, clearError } = useAuthContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    /**
     * Validate form data
     */
    const validateForm = () => {
        const newErrors = {};
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear auth error
        if (authError) {
            clearError();
        }
    };
    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form first
        if (!validateForm()) {
            return;
        }
        setIsSuccess(false);
        // Call login function
        const success = await authLogin({
            email: formData.email.trim(),
            password: formData.password,
        });
        if (success) {
            setIsSuccess(true);
            setFormData({
                email: '',
                password: '',
            });
            // Reset success message after 3 seconds
            setTimeout(() => setIsSuccess(false), 3000);
        }
    };
    return (<Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Welcome back to Travellers Thing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Alert */}
          {isSuccess && (<Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ Login successful! Redirecting...
              </AlertDescription>
            </Alert>)}

          {/* Error Alert */}
          {authError && (<Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{authError}</AlertDescription>
            </Alert>)}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} disabled={isLoading} className={errors.email ? 'border-red-500' : ''} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}/>
            {errors.email && (<p id="email-error" className="text-sm text-red-500">
                {errors.email}
              </p>)}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••" value={formData.password} onChange={handleChange} disabled={isLoading} className={errors.password ? 'border-red-500' : ''} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}/>
            {errors.password && (<p id="password-error" className="text-sm text-red-500">
                {errors.password}
              </p>)}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full mt-6">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline font-semibold">
              Sign up
            </a>
          </p>

          {/* Forgot Password Link */}
          <p className="text-center text-sm">
            <a href="/forgot-password" className="text-gray-600 hover:text-primary">
              Forgot password?
            </a>
          </p>
        </form>
      </CardContent>
    </Card>);
}
