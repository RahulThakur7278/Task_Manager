import { memo, useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { HiCheck, HiTrash } from 'react-icons/hi2';
import { Draggable } from '@hello-pangea/dnd';

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
    } finally {
      setIsToggling(false);
    }
  }, [task._id, task.completed, toggleTask]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task._id);
    } catch (error) {
      console.error('Error deleting task:', error);
      setIsDeleting(false);
    }
  }, [task._id, deleteTask]);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
            border group animate-slide-in
            ${snapshot.isDragging ? 'shadow-xl scale-[1.02]' : 'shadow-sm hover:shadow-md'}
            ${isDeleting ? 'animate-slide-out opacity-0' : ''}`}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging
              ? 'var(--color-primary-50, var(--bg-tertiary))'
              : 'var(--card-bg)',
            borderColor: snapshot.isDragging
              ? 'var(--color-primary-300)'
              : 'var(--border-color)',
          }}
        >
          {/* Drag indicator */}
          <div
            className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab"
          >
            <span className="block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
            <span className="block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
            <span className="block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
          </div>

          {/* Checkbox */}
          <button
            id={`toggle-task-${task._id}`}
            onClick={handleToggle}
            disabled={isToggling}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all duration-300 cursor-pointer flex-shrink-0
              ${task.completed
                ? 'border-success-500 bg-success-500'
                : 'border-surface-300 hover:border-primary-400'
              }`}
            style={{ backgroundColor: task.completed ? 'var(--color-success-500)' : 'transparent' }}
          >
            {task.completed && <HiCheck className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Title */}
          <span
            className={`flex-1 text-sm font-medium transition-all duration-200 select-none
              ${task.completed ? 'line-through' : ''}`}
            style={{
              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
            }}
          >
            {task.title}
          </span>

          {/* Timestamp */}
          <span
            className="text-xs hidden sm:block"
            style={{ color: 'var(--text-muted)' }}
          >
            {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>

          {/* Delete */}
          <button
            id={`delete-task-${task._id}`}
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200
              cursor-pointer border-none hover:bg-danger-500/10"
            style={{ backgroundColor: 'transparent', color: 'var(--color-danger-500)' }}
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
