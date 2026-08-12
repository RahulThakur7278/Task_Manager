import { Outlet } from 'react-router-dom';
import Header from './Header';
import { TaskProvider } from '../context/TaskContext';

const Layout = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header />
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
};

export default Layout;
