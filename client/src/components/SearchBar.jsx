import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from './Icons';

function SearchBar({
  onSearch,
  placeholder = 'Search components, styles, categories...',
  showFilters = true,
  initialQuery = '',
  onFilterChange
}) {
  const [query, setQuery] = useState(initialQuery);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    style: '',
    tags: '',
    sortBy: 'relevance'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() || filters.category || filters.style) {
        const searchParams = new URLSearchParams();
        if (query) searchParams.set('q', query);
        if (filters.category) searchParams.set('category', filters.category);
        if (filters.style) searchParams.set('style', filters.style);
        if (filters.sortBy) searchParams.set('sort', filters.sortBy);
        
        navigate(`/search?${searchParams.toString()}`);
        onSearch?.(query, filters);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, navigate, onSearch]);

  const handleClear = () => {
    setQuery('');
    setFilters({
      category: '',
      style: '',
      tags: '',
      sortBy: 'relevance'
    });
    navigate('/search');
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <div className="pl-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          
          {query && (
            <button
              onClick={handleClear}
              className="pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`pr-4 border-l border-gray-300 dark:border-gray-600 ml-2 ${
                isFiltersOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {isFiltersOpen && (
        <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                <option value="buttons">Buttons</option>
                <option value="cards">Cards</option>
                <option value="forms">Forms</option>
                <option value="navigation">Navigation</option>
                <option value="modals">Modals</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Style
              </label>
              <select
                value={filters.style}
                onChange={(e) => handleFilterChange('style', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Styles</option>
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="playful">Playful</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    style: '',
                    tags: '',
                    sortBy: 'relevance'
                  });
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
