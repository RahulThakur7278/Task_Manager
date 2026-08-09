import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi2';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none
        cursor-pointer flex items-center px-1"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--color-primary-600)' : 'var(--color-surface-300)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span
        className="absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center"
        style={{
          transform: theme === 'dark' ? 'translateX(28px)' : 'translateX(0)',
        }}
      >
        {theme === 'dark' ? (
          <HiMoon className="w-3 h-3 text-primary-600" />
        ) : (
          <HiSun className="w-3 h-3 text-warning-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
