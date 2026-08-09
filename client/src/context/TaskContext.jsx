import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../api/axios';
import useDebounce from '../hooks/useDebounce';
import { TASK_FILTERS, TASKS_PER_PAGE } from '../utils/constants';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(TASK_FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch tasks whenever filter, search, or page changes
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', {
        params: {
          page,
          limit: TASKS_PER_PAGE,
          status: filter,
          q: debouncedSearch,
        },
      });
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  const addTask = useCallback(async (title) => {
    const { data } = await api.post('/tasks', { title });
    setTasks((prev) => [data.task, ...prev]);
    setTotalTasks((prev) => prev + 1);
    return data.task;
  }, []);

  const toggleTask = useCallback(async (id, completed) => {
    const { data } = await api.put(`/tasks/${id}`, { completed: !completed });
    setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    return data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setTotalTasks((prev) => prev - 1);
  }, []);

  const reorderTasks = useCallback(async (reorderedTasks) => {
    setTasks(reorderedTasks);
    const orderedIds = reorderedTasks.map((t) => t._id);
    try {
      await api.put('/tasks/reorder', { orderedIds });
    } catch (error) {
      console.error('Error reordering tasks:', error);
      fetchTasks(); // Revert on failure
    }
  }, [fetchTasks]);

  const value = useMemo(
    () => ({
      tasks,
      filter,
      setFilter,
      searchQuery,
      setSearchQuery,
      page,
      setPage,
      totalPages,
      totalTasks,
      loading,
      addTask,
      toggleTask,
      deleteTask,
      reorderTasks,
      fetchTasks,
    }),
    [tasks, filter, searchQuery, page, totalPages, totalTasks, loading, addTask, toggleTask, deleteTask, reorderTasks, fetchTasks]
  );

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
