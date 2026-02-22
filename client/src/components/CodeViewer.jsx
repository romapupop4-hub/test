import React, { useState } from 'react';

const CodeViewer = ({ htmlCode, cssCode, reactCode, title = 'Code' }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'html', label: 'HTML', code: htmlCode },
    { id: 'css', label: 'CSS', code: cssCode },
    { id: 'react', label: 'React', code: reactCode },
  ].filter(tab => tab.code);

  const currentCode = tabs.find(t => t.id === activeTab)?.code || '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const highlightSyntax = (code, lang) => {
    if (!code) return '';
    
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (lang === 'html') {
      highlighted = highlighted
        .replace(/(&lt;\/?[\w-]+)/g, '<span class="text-pink-500">$1</span>')
        .replace(/([\w-]+)=/g, '<span class="text-yellow-500">$1</span>=</span>')
        .replace(/"([^"]*)"/g, '"<span class="text-green-400">$1</span>"')
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-gray-500">$1</span>');
    } else if (lang === 'css') {
      highlighted = highlighted
        .replace(/([\w-]+)\s*:/g, '<span class="text-yellow-500">$1</span>:')
        .replace(/([.#][\w-]+)/g, '<span class="text-pink-500">$1</span>')
        .replace(/(\d+)(px|em|rem|%|vh|vw)?/g, '<span class="text-orange-400">$1$2</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
    } else if (lang === 'react') {
      highlighted = highlighted
        .replace(/(&lt;\/?[\w-]+)/g, '<span class="text-pink-500">$1</span>')
        .replace(/\b(const|let|var|function|return|import|export|from|default|useState|useEffect)\b/g, '<span class="text-purple-500">$1</span>')
        .replace(/(\{[\s\S]*?\})/g, '<span class="text-yellow-500">$1</span>')
        .replace(/"([^"]*)"/g, '"<span class="text-green-400">$1</span>"');
    }

    return highlighted;
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {tabs.length > 1 && (
        <div className="flex gap-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code
            dangerouslySetInnerHTML={{ __html: highlightSyntax(currentCode, activeTab) }}
            className="text-gray-800 dark:text-gray-200"
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
