/**
 * Login Page
 */

import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="text-center text-xs text-gray-500 mt-8">
          Your information is secure and encrypted
        </p>
      </div>
    </div>
  );
}
