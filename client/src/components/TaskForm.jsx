import { useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { HiPlus } from 'react-icons/hi2';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const { addTask } = useTasks();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError('Task title cannot be empty');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    if (trimmed.length > 200) {
      setError('Task title cannot exceed 200 characters');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addTask(trimmed);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, addTask]);

  return (
    <form
      id="task-form"
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 ${shakeError ? 'animate-shake' : ''}`}
    >
      <div className="flex gap-2">
        <input
          id="task-input"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
            border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            borderColor: error ? 'var(--color-danger-500)' : 'var(--border-color)',
          }}
          disabled={isSubmitting}
          autoComplete="off"
        />
        <button
          id="add-task-btn"
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-3 rounded-xl text-sm font-semibold text-white gradient-primary
            hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer
            border-none shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2"
        >
          <HiPlus className="w-4 h-4" />
          <span className="hidden sm:inline">{isSubmitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium animate-fade-in" style={{ color: 'var(--color-danger-500)' }}>
          {error}
        </p>
      )}
    </form>
  );
};

export default TaskForm;
