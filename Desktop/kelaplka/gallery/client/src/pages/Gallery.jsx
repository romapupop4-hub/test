import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import ComponentCard from '../components/ComponentCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams()
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
    categoryId: searchParams.get('category') || '',
    styleId: searchParams.get('style') || '',
    sortBy: searchParams.get('sort') || 'newest'
  })

  useEffect(() => {
    fetchComponents()
  }, [pagination.page, filters])

  useEffect(() => {
    const categoryId = searchParams.get('category')
    if (categoryId && categoryId !== filters.categoryId) {
      setFilters(prev => ({ ...prev, categoryId }))
    }
  }, [searchParams])

  const fetchComponents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { q: filters.search }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.styleId && { styleId: filters.styleId }),
        sortBy: filters.sortBy
      })
      
      const { data } = await api.get(`/components?${params}`)
      setComponents(data.components || [])
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0
      }))
    } catch (error) {
      toast.error('Failed to load components')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchFilters) => {
    setFilters(prev => ({ ...prev, ...searchFilters }))
    setPagination(prev => ({ ...prev, page: 1 }))
    
    const params = new URLSearchParams()
    if (searchFilters.search) params.set('q', searchFilters.search)
    if (searchFilters.categoryId) params.set('category', searchFilters.categoryId)
    if (searchFilters.styleId) params.set('style', searchFilters.styleId)
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getCategoryName = () => {
    if (!filters.categoryId) return 'All Components'
    const category = components[0]?.Category?.name
    return category || 'Components'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {getCategoryName()}
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
            No components found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or filters
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
