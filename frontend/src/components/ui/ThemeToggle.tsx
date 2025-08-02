import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-yellow-500/10 dark:to-orange-500/10 backdrop-blur-sm border border-blue-200/30 dark:border-yellow-200/30 hover:from-blue-500/20 hover:to-purple-500/20 dark:hover:from-yellow-500/20 dark:hover:to-orange-500/20 transition-all duration-300 group"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        {isDark ? (
          <div className="text-yellow-400 text-lg transform group-hover:scale-110 transition-transform duration-200">☀️</div>
        ) : (
          <div className="text-indigo-600 text-lg transform group-hover:scale-110 transition-transform duration-200">🌙</div>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;