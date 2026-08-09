import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { HiOutlineBars3, HiXMark, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { MdDashboard } from "react-icons/md";
import { GoGraph } from "react-icons/go";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return '';
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
    { to: '/analytics', label: 'Analytics', icon: GoGraph },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px var(--shadow-color)',
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 w-full ">
          {/* Left Side: Logo */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg gradient-primary">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span
                className="text-xl font-bold hidden sm:block"
                style={{ color: 'var(--text-primary)' }}
              >
                Task<span className="text-gradient">Flow</span>
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
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline hover:bg-[var(--hover-bg)]"
                    style={{ backgroundColor: isActive ? 'transparent' : 'transparent' }}
                  >
                    <Icon 
                      className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-[#6366f1]' : 'text-[var(--text-secondary)] group-hover:text-[#6366f1]'}`} 
                    />
                    <span
                      className={`transition-all duration-200 ${isActive ? 'text-gradient' : 'text-[var(--text-secondary)] group-hover:text-gradient'}`}
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

            {/* User Info */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--hover-bg)' }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center gradient-primary">
                <span className="text-white text-xs font-semibold">
                  {getInitials(user?.name)}
                </span>
              </div>

            </div>

            {/* Logout */}
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 cursor-pointer border-none"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-danger-500)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <HiArrowRightOnRectangle className="w-6 h-6" />
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg cursor-pointer border-none"
              style={{
                backgroundColor: 'var(--hover-bg)',
                color: 'var(--text-primary)',
              }}
            >
              {mobileMenuOpen ? <HiXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-3 border-t animate-fade-in"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors duration-200"
                style={{
                  backgroundColor: 'transparent',
                  color: location.pathname === to ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium
                cursor-pointer border-none text-left"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-danger-500)',
              }}
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
