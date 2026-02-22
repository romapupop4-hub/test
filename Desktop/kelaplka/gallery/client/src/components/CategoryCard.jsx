import React from 'react';

export default function CategoryCard({ category, onClick }) {
  const { name, description, icon, componentCount = 0 } = category;
  
  const defaultIcons = {
    'layout': 'M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z',
    'navigation': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7-7-7 7',
    'forms': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'buttons': 'M15 15l-2 5L3 21l9-9m0 0l7-7 7',
    'cards': 'M19 11H5m14 0a2 2 0 012 2h6a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z',
    'modals': 'M8 7v8a2 2 0 002 2h4m8-12V7a2 2 0 00-2-2H4a2 2 0 00-2 2v4z',
    'tables': 'M3 10h18M3 14h18m-9-4v8m0 0l3-3m-3 3l3 3',
    'charts': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm6 0V5a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    'media': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    'typography': 'M3 5h12M3 12h12m-6-4h6M5 19h6',
    'footer': 'M5 3v4m0 0v4m0-4h4m-4 8h4m0-4V3m-4 16v-4m0 0v4',
    'sidebar': 'M4 6h16M4 12h16M4 18h16',
    'default': 'M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z'
  };

  const getIcon = () => {
    if (icon && typeof icon === 'string' && icon.includes('M')) return icon;
    return defaultIcons[icon] || defaultIcons.default;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon()} />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {description}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
              {componentCount} components
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
