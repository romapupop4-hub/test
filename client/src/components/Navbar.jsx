import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Menu, X, Sun, Moon, User, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UI</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Asset Gallery</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`text-sm font-medium transition-colors ${isActive('/gallery') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
            >
              Gallery
            </Link>
            <Link 
              to="/categories" 
              className={`text-sm font-medium transition-colors ${isActive('/categories') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
            >
              Categories
            </Link>
            <Link 
              to="/styles" 
              className={`text-sm font-medium transition-colors ${isActive('/styles') ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'}`}
            >
              Styles
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 text-gray-900 dark:text-white placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to="/favorites"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Favorites"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            <div className="flex flex-col space-y-2">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/gallery" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Gallery
              </Link>
              <Link to="/categories" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
              <Link to="/styles" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Styles
              </Link>
              {user && (
                <>
                  <Link to="/favorites" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Favorites
                  </Link>
                  <Link to="/profile" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left">
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
