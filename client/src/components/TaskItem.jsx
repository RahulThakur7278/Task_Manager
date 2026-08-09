import { memo, useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { HiCheck, HiTrash } from 'react-icons/hi2';
import { Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';

const TaskItem = memo(({ task, index }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = useCallback(async () => {
    setIsToggling(true);
    try {
      await toggleTask(task._id, task.completed);
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsToggling(false);
    }
  }, [task._id, task.completed, toggleTask]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      setIsDeleting(false);
    }
  }, [task._id, deleteTask]);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center gap-4 sm:gap-5 px-5 py-4 rounded-xl transition-all duration-200
            border group
            ${snapshot.isDragging ? 'shadow-xl scale-[1.02] z-50' : 'hover:shadow-md z-10'}
            ${isDeleting ? 'animate-slide-out opacity-0' : ''}`}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging
              ? 'var(--color-primary-50, var(--bg-tertiary))'
              : 'var(--bg-primary)',
            borderColor: snapshot.isDragging
              ? 'var(--color-primary-300)'
              : 'var(--border-color)',
          }}
        >
          {/* Drag indicator */}
          <div
            className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab"
          >
            <span className="block w-3 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
            <span className="block w-3 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
            <span className="block w-3 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
          </div>

          {/* Checkbox */}
          <button
            id={`toggle-task-${task._id}`}
            onClick={handleToggle}
            disabled={isToggling}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all duration-300 cursor-pointer flex-shrink-0"
            style={{
              borderColor: task.completed ? 'var(--color-success-500)' : 'var(--color-surface-300)',
              backgroundColor: task.completed ? 'var(--color-success-500)' : 'transparent',
            }}
          >
            {task.completed && <HiCheck className="w-4 h-4 text-white" />}
          </button>

          {/* Title + Meta */}
          <div className="flex-1 min-w-0">
            <span
              className={`text-[15px] font-medium transition-all duration-200 select-none block truncate
                ${task.completed ? 'line-through' : ''}`}
              style={{
                color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              }}
            >
              {task.title}
            </span>
          </div>

          {/* Timestamp */}
          <span
            className="text-xs hidden sm:block flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            {timeAgo(task.createdAt)}
          </span>

          {/* Status badge */}
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full hidden sm:block flex-shrink-0"
            style={{
              backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: task.completed ? '#22c55e' : '#f59e0b',
            }}
          >
            {task.completed ? 'Done' : 'Pending'}
          </span>

          {/* Delete */}
          <button
            id={`delete-task-${task._id}`}
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200
              cursor-pointer border-none"
            style={{ backgroundColor: 'transparent', color: 'var(--color-danger-500)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      )}
    </Draggable>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
