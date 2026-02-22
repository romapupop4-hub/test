import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import ComponentCard from '../components/ComponentCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

export default function Search() {
  const [searchParams] = useSearchParams()
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    categoryId: '',
    styleId: '',
    sortBy: 'relevance'
  })

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setFilters(prev => ({ ...prev, search: query }))
    }
  }, [searchParams])

  useEffect(() => {
    if (filters.search) {
      fetchSearchResults()
    }
  }, [pagination.page, filters])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        q: filters.search,
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.styleId && { styleId: filters.styleId }),
        sortBy: filters.sortBy
      })
      
      const { data } = await api.get(`/search?q=${filters.search}&${params.toString().replace('q=' + filters.search + '&', '')}`)
      setComponents(data.components || [])
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0
      }))
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchFilters) => {
    setFilters(prev => ({ ...prev, ...searchFilters }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Search Results
          {filters.search && (
            <span className="text-indigo-600 dark:text-indigo-400">
              {' '}"{filters.search}"
            </span>
          )}
        </h1>
        <SearchBar onSearch={handleSearch} initialValues={filters} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : components.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No results found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try different keywords or adjust your filters
          </p>
          <button
            onClick={() => handleSearch({ search: '', categoryId: '', styleId: '' })}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Found {pagination.total} results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {components.map(component => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
