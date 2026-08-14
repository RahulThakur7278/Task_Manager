import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import UserLogin from './pages/user/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CreateTask from './pages/CreateTask';
import ManageTask from './pages/ManageTask';
import Team from './pages/Team';
import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import UserMyTasks from './pages/user/MyTask';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Admin Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/create-task" element={<CreateTask />} />
              <Route path="/manage-task" element={<ManageTask />} />
              <Route path="/team" element={<Team />} />
            </Route>

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="my-tasks" element={<UserMyTasks />} />
            </Route>

            {/* Catch-all redirect */}
            <Route
              path="*"
              element={
                <Navigate
                  to={window.location.port === '3000' ? '/user/dashboard' : '/'}
                  replace
                />
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
