import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import StatsCard from '../components/StatsCard';
import { useTasks } from '../context/TaskContext';

const Dashboard = () => {
  const { totalTasks } = useTasks();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          My Tasks
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {totalTasks > 0
            ? `You have ${totalTasks} task${totalTasks !== 1 ? 's' : ''}`
            : 'No tasks yet — add one to get started'}
        </p>
      </div>

      {/* Stats Card */}
      <div className="mb-6">
        <StatsCard />
      </div>

      {/* Add Task */}
      <div className="mb-6">
        <TaskForm />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar />
        </div>
        <FilterBar />
      </div>

      {/* Task List */}
      <TaskList />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default Dashboard;
