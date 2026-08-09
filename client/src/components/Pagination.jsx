import { useTasks } from '../context/TaskContext';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = () => {
  const { page, setPage, totalPages, totalTasks } = useTasks();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        {totalTasks} task{totalTasks !== 1 ? 's' : ''} total
      </p>

      <div className="flex items-center gap-1">
        <button
          id="prev-page-btn"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg transition-all duration-200 cursor-pointer border-none
            disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--hover-bg)',
            color: 'var(--text-secondary)',
          }}
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200
              cursor-pointer border-none"
            style={{
              backgroundColor: page === num ? 'var(--color-primary-500)' : 'transparent',
              color: page === num ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {num}
          </button>
        ))}

        <button
          id="next-page-btn"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg transition-all duration-200 cursor-pointer border-none
            disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--hover-bg)',
            color: 'var(--text-secondary)',
          }}
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
