import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin' | 'agent'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleEmojis = {
    user: '👤',
    agent: '🛡️',
    admin: '⚙️'
  };

  const roleColors = {
    user: 'from-green-500 to-emerald-500',
    agent: 'from-blue-500 to-indigo-500',
    admin: 'from-purple-500 to-pink-500'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">Q</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Join QuickDesk
          </h2>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-bounce-in">
              <span className="text-red-500">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="transform transition-transform hover:scale-105">
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative transform transition-transform hover:scale-105">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="relative transform transition-transform hover:scale-105">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Select your role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['user', 'agent', 'admin'] as const).map((role) => {
                  const emoji = roleEmojis[role];
                  const isSelected = formData.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? `border-transparent bg-gradient-to-r ${roleColors[role]} text-white shadow-lg`
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className="text-xs font-medium capitalize">{role}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Already have an account? <span className="underline">Sign in here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;