import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { HiOutlineBars3, HiXMark, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { MdDashboard, MdAddTask } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return 'A';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: MdDashboard },
    { to: '/create-task', label: 'Create Task', icon: MdAddTask },
    { to: '/manage-task', label: 'Manage Task', icon: FaTasks },
    { to: '/team', label: 'Team', icon: FaUserGroup },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm transition-colors duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 w-full">
          {/* Left Side: Logo */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold hidden sm:block dark:text-white">
                Task<span className="bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent">Flow</span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <div className="hidden md:flex justify-center">
            <nav className="flex items-center gap-3">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;

                return (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500'}`}
                    />
                    <span
                      className={`transition-all duration-200 ${isActive ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent' : 'text-slate-500 dark:text-slate-400 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent whitespace-nowrap'}`}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-end gap-3">
            <ThemeToggle />

            {/* User Info Avatar & Name */}
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

            {/* Logout */}
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none text-red-500 hover:bg-red-500/10"
            >
              <HiArrowRightOnRectangle className="w-5 h-5 text-red-500" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg cursor-pointer border-none text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <HiXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors duration-200 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium cursor-pointer border-none text-left text-red-500 hover:bg-red-500/10"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
