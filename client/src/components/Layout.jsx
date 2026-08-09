import { Outlet } from 'react-router-dom';
import Header from './Header';
import { TaskProvider } from '../context/TaskContext';

const Layout = () => {
  return (
    <TaskProvider>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <Header />
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '1152px', margin: '0 auto', padding: '40px 48px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
};

export default Layout;
