import { Link } from 'react-router-dom';

function StyleCard({ style, showDescription = true }) {
  const { id, name, description, color, category, componentCount } = style;

  return (
    <Link
      to={`/styles/${id}`}
      className="block group"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div
          className="h-32 flex items-center justify-center"
          style={{ backgroundColor: color || '#6366f1' }}
        >
          <div className="grid grid-cols-3 gap-2 opacity-75">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded bg-white/30"
              />
            ))}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {name}
          </h3>
          
          {showDescription && description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {componentCount || 0} components
            </span>
            
            {category && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StyleCard;
