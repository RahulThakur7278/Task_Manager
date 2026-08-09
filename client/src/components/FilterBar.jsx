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
    <div
      style={{
        display: 'flex',
        gap: '5px',
        padding: '3px',
        borderRadius: '10px',
        backgroundColor: 'var(--hover-bg)',
      }}
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          id={`filter-${value}`}
          onClick={() => setFilter(value)}
          className={`text-[11px] sm:text-[13px] ${filter === value ? 'gradient-primary' : ''}`}
          style={{
            padding: '10px 10px',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s ease',
            background: filter === value ? undefined : 'transparent',
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
