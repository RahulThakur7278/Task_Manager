import { useTasks } from '../context/TaskContext';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useTasks();

  return (
    <div style={{ position: 'relative' }}>
      <HiMagnifyingGlass
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '18px',
          height: '18px',
          color: 'var(--text-muted)',
        }}
      />
      <input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="w-full rounded-xl font-medium transition-all duration-200
          border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
        style={{
          backgroundColor: 'var(--input-bg)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)',
          padding: '10px 44px 10px 46px',
          fontSize: '14px',
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '4px',
            borderRadius: '50%',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'var(--hover-bg)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HiXMark style={{ width: '14px', height: '14px' }} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
