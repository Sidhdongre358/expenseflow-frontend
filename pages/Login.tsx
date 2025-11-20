
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login } from '../features/auth/authSlice';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error, isAuthenticated } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('demo@expenseflow.com');
  const [password, setPassword] = useState('password123');

  useEffect(() => {
      if (isAuthenticated) {
          navigate('/');
      }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(email));
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login via same action for now
    dispatch(login(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 relative">
      {/* Back to Home Link */}
      <button 
        onClick={() => navigate('/landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Home
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-200 dark:border-border-dark overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="bg-primary/10 p-2 rounded-xl">
                   <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ExpensePro</h1>
               </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Sign in to your account</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Welcome back! Please enter your details.</p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-card-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors transition-transform transform active:scale-[0.98] disabled:opacity-50"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-xl">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-sm font-medium text-primary hover:text-primary-600">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-xl">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {status === 'loading' && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="font-medium text-primary hover:text-primary-600 transition-colors">Sign up</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
