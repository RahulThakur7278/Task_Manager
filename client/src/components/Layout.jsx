import { Outlet } from 'react-router-dom';
import Header from './Header';
import { TaskProvider } from '../context/TaskContext';

const Layout = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </TaskProvider>
  );
};

export default Layout;
