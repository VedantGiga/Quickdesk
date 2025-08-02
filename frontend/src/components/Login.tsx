import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">Q</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-slate-300">Sign in to your QuickDesk account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl flex items-center space-x-2">
              <span className="text-red-500 dark:text-red-300">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="transform transition-transform hover:scale-105">
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-600/70 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative transform transition-transform hover:scale-105">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-600/70 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <Link
              to="/register"
              className="text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
            >
              Don't have an account? <span className="underline">Register here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;