import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import StyleCard from '../components/StyleCard'

export default function Styles() {
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filteredStyles, setFilteredStyles] = useState([])

  useEffect(() => {
    fetchStyles()
  }, [])

  useEffect(() => {
    if (search) {
      const filtered = styles.filter(style =>
        style.name.toLowerCase().includes(search.toLowerCase()) ||
        style.description?.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredStyles(filtered)
    } else {
      setFilteredStyles(styles)
    }
  }, [search, styles])

  const fetchStyles = async () => {
    try {
      const { data } = await api.get('/styles')
      setStyles(data.styles || data || [])
      setFilteredStyles(data.styles || data || [])
    } catch (error) {
      toast.error('Failed to load styles')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Design Styles
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Explore different design styles for your UI components
        </p>
        
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredStyles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No styles found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {search ? 'Try a different search term' : 'No styles available'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStyles.map(style => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      )}
    </div>
  )
}
