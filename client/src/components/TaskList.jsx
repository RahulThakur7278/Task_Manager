import { useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { HiClipboardDocumentList } from 'react-icons/hi2';

const TaskList = () => {
  const { tasks, reorderTasks, loading } = useTasks();

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    reorderTasks(reordered);
  }, [tasks, reorderTasks]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 py-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-xl animate-pulse-soft"
            style={{ backgroundColor: 'var(--hover-bg)' }}
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--hover-bg)' }}
        >
          <HiClipboardDocumentList className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            No tasks found
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Add a task above to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2"
          >
            {tasks.map((task, index) => (
              <TaskItem key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
