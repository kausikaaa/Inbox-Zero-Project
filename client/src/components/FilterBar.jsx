import PropTypes from 'prop-types';

function FilterBar({ 
  currentFilter, 
  onFilterChange, 
  emailCounts = { all: 0, unread: 0, read: 0 },
  showSearch = false,
  searchQuery = "",
  onSearchChange
}) {
  const filters = [
    { 
      key: 'all', 
      label: 'All Emails', 
      icon: '📧',
      count: emailCounts.all 
    },
    { 
      key: 'unread', 
      label: 'Unread', 
      icon: '🔵',
      count: emailCounts.unread 
    },
    { 
      key: 'read', 
      label: 'Read', 
      icon: '✅',
      count: emailCounts.read 
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentFilter === filter.key
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  currentFilter === filter.key
                    ? 'bg-indigo-200 text-indigo-800'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar (Optional) */}
        {showSearch && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter Results Summary */}
      <div className="mt-3 text-sm text-gray-600">
        {currentFilter === 'all' && (
          <span>Showing all {emailCounts.all} emails</span>
        )}
        {currentFilter === 'unread' && (
          <span>Showing {emailCounts.unread} unread emails</span>
        )}
        {currentFilter === 'read' && (
          <span>Showing {emailCounts.read} read emails</span>
        )}
        {searchQuery && (
          <span className="ml-2">• Search: "{searchQuery}"</span>
        )}
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  currentFilter: PropTypes.oneOf(['all', 'unread', 'read']).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  emailCounts: PropTypes.shape({
    all: PropTypes.number,
    unread: PropTypes.number,
    read: PropTypes.number,
  }),
  showSearch: PropTypes.bool,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
};

export default FilterBar;