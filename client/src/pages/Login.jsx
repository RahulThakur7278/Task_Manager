import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiArrowRightOnRectangle, HiEye, HiEyeSlash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const target = user?.role === 'admin' ? '/' : '/user/dashboard';
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success('Login successful!');
      if (res?.user?.role === 'admin') {
        navigate('/');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans">
      {/* Blue Header */}
      <header className="text-white h-16 flex items-center justify-end px-6 shadow-md z-10 w-full bg-blue-500">
        <Link to="/login" className="flex items-center gap-2 text-white font-medium hover:bg-white/10 px-4 py-2 rounded transition-colors no-underline uppercase text-sm tracking-wider">
          <HiArrowRightOnRectangle className="w-5 h-5" />
          Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-white rounded-md shadow-md w-full max-w-[450px] p-4">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-5">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col w-full">

            {/* Email Input */}
            <div className="relative mb-4" >
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block py-3 w-full text-sm text-gray-900 bg-transparent rounded border border-gray-300 appearance-none focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 duration-200 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] bg-white px-1 left-2 peer-focus:text-[#06b6d4] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75"
              >
                Email *
              </label>
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full py-3  text-sm text-gray-900 bg-transparent rounded border border-gray-300 appearance-none focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] peer pr-10"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 duration-200 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] bg-white px-1 left-2 peer-focus:text-[#06b6d4] peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75"
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
              className="bg-blue-500 text-white py-2 rounded cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600" style={{ marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-[#6366f1] hover:underline no-underline">
              Register
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-2">
            Are you a team member?{' '}
            <Link to="/user/login" className="text-blue-600 hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 w-full">
        © 2026 TaskFlow · Built by Rahul Thakur
      </footer>
    </div>
  );
};

export default Login;
