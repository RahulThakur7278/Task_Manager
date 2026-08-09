import { useTasks } from '../context/TaskContext';
import { TASK_FILTERS } from '../utils/constants';

const filters = [
  { value: TASK_FILTERS.ALL, label: 'All' },
  { value: TASK_FILTERS.PENDING, label: 'Pending' },
  { value: TASK_FILTERS.COMPLETED, label: 'Completed' },
];

const FilterBar = () => {
  const { filter, setFilter } = useTasks();

  return (
    <div className="flex gap-1.5 p-1 rounded-xl" style={{ backgroundColor: 'var(--hover-bg)' }}>
      {filters.map(({ value, label }) => (
        <button
          key={value}
          id={`filter-${value}`}
          onClick={() => setFilter(value)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
            cursor-pointer border-none flex-1 sm:flex-none`}
          style={{
            backgroundColor: filter === value ? 'var(--color-primary-500)' : 'transparent',
            color: filter === value ? '#fff' : 'var(--text-secondary)',
            boxShadow: filter === value ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
