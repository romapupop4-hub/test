import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import CategoryCard from '../components/CategoryCard'
import SearchBar from '../components/SearchBar'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      setCategories(data.categories || [])
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  )

  const featuredCategories = filteredCategories.filter(cat => cat.isFeatured)
  const regularCategories = filteredCategories.filter(cat => !cat.isFeatured)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Categories
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Browse components by category
        </p>
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {featuredCategories.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCategories.map(category => (
                  <CategoryCard key={category.id} category={category} featured />
                ))}
              </div>
            </section>
          )}

          {regularCategories.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                All Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularCategories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No categories found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Try a different search term
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
