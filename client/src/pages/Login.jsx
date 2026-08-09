import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiArrowRightOnRectangle, HiEye, HiEyeSlash } from 'react-icons/hi2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans">
      {/* Blue Header */}
      <header className="bg-[#1976d2] text-white h-16 flex items-center justify-end px-6 shadow-md z-10 w-full">
        <Link to="/login" className="flex items-center gap-2 text-white font-medium hover:bg-white/10 px-4 py-2 rounded transition-colors no-underline uppercase text-sm tracking-wider">
          <HiArrowRightOnRectangle className="w-5 h-5" />
          Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white rounded-md shadow-md w-full max-w-[450px]" style={{ padding: '2.5rem 2rem' }}>
          <h1 className="text-2xl font-bold text-center text-gray-900" style={{ marginBottom: '2rem' }}>Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200 text-center" style={{ marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="relative" style={{ marginBottom: '1.5rem' }}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full text-sm text-gray-900 bg-transparent rounded border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1976d2] focus:border-[#1976d2] peer"
                style={{ padding: '1rem 0.75rem' }}
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 duration-200 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] bg-white px-1 left-2 peer-focus:text-[#1976d2] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75"
              >
                Email *
              </label>
            </div>

            {/* Password Input */}
            <div className="relative" style={{ marginBottom: '1.5rem' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full text-sm text-gray-900 bg-transparent rounded border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1976d2] focus:border-[#1976d2] peer pr-10"
                style={{ padding: '1rem 0.75rem' }}
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 duration-200 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] bg-white px-1 left-2 peer-focus:text-[#1976d2] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75"
              >
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer p-1"
              >
                {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white font-medium rounded transition-colors uppercase tracking-wider text-sm border-none cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ marginTop: '0.5rem', padding: '0.875rem' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600" style={{ marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1976d2] hover:underline no-underline">
              Register
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 w-full">
        © 2026 ExpenseTracker · Built by Rahul Thakur
      </footer>
    </div>
  );
};

export default Login;
