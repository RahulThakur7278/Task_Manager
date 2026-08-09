import { useTasks } from '../context/TaskContext';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useTasks();

  return (
    <div className="relative">
      <HiMagnifyingGlass
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
          border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)',
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full cursor-pointer border-none
            transition-colors duration-200"
          style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-muted)' }}
        >
          <HiXMark className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
