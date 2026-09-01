import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCheckSquare } from 'react-icons/fi';
import { HiArrowRightOnRectangle, HiOutlineBars3, HiXMark } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/user/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 w-full">
          {/* Left: Logo */}
          <div className="flex justify-start items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskFlow User
            </h1>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex justify-center">
            <nav className="flex items-center space-x-1">
              <NavLink
                to="/user/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                <FiHome className="text-lg" /> Dashboard
              </NavLink>
              <NavLink
                to="/user/my-tasks"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                <FiCheckSquare className="text-lg" /> My Tasks
              </NavLink>
            </nav>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center justify-end gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Avatar & Name */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--hover-bg)' }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-500">
                <span className="text-white text-xs font-semibold">
                  {getInitials(user?.name)}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none text-red-500 hover:bg-red-500/10"
            >
              <HiArrowRightOnRectangle className="w-5 h-5 text-red-500" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg cursor-pointer border-none text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                <FiHome className="text-lg" /> Dashboard
              </NavLink>
              <NavLink
                to="/user/my-tasks"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }`
                }
              >
                <FiCheckSquare className="text-lg" /> My Tasks
              </NavLink>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none text-left text-red-500 hover:bg-red-500/10"
              >
                <HiArrowRightOnRectangle className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
