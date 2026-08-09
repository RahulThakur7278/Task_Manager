import { useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { HiPlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const { addTask } = useTasks();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      toast.error('Task title cannot be empty');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    if (trimmed.length > 200) {
      toast.error('Task title cannot exceed 200 characters');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setIsSubmitting(true);

    try {
      await addTask(trimmed);
      setTitle('');
      toast.success('Task added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
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
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            id="task-input"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="What needs to be done?"
            className="w-full rounded-xl font-medium transition-all duration-200
              border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            style={{
              backgroundColor: 'var(--input-bg)',
              color: 'var(--text-primary)',
              borderColor: shakeError ? 'var(--color-danger-500)' : 'var(--border-color)',
              padding: '16px 20px',
              fontSize: '15px',
            }}
            disabled={isSubmitting}
            autoComplete="off"
          />
          {title.length > 0 && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
              style={{ color: title.length > 180 ? 'var(--color-danger-500)' : 'var(--text-muted)' }}
            >
              {title.length}/200
            </span>
          )}
        </div>
        <button
          id="add-task-btn"
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl font-semibold text-white gradient-primary
            hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer
            border-none shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2 flex-shrink-0"
          style={{ padding: '16px 24px', fontSize: '15px' }}
        >
          <HiPlus className="w-5 h-5" />
          <span className="hidden sm:inline">{isSubmitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </div>

    </form>
  );
};

export default TaskForm;
