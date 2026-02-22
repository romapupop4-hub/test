import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import CodeViewer from '../components/CodeViewer'
import { HeartIcon, CodeIcon, EyeIcon } from '../components/Icons'

export default function ComponentDetail() {
  const { id } = useParams()
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeVariation, setActiveVariation] = useState(0)
  const [codeView, setCodeView] = useState('html')
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchComponent()
  }, [id])

  useEffect(() => {
    if (component?.Variations) {
      setActiveVariation(0)
    }
  }, [component?.id])

  const fetchComponent = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/components/${id}`)
      setComponent(data.component)
      
      if (data.component?.Favorites?.length > 0) {
        setIsFavorite(true)
      }
    } catch (error) {
      toast.error('Failed to load component')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await api.post('/favorites', { componentId: id })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Please login to save favorites')
    }
  }

  const currentVariation = component?.Variations?.[activeVariation]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-8"></div>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-96"></div>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Component not found
        </h2>
        <Link to="/gallery" className="text-indigo-600 hover:underline">
          Back to Gallery
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/gallery" className="hover:text-indigo-600">Gallery</Link>
        <span>/</span>
        {component.Category && (
          <>
            <Link to={`/gallery?category=${component.Category.id}`} className="hover:text-indigo-600">
              {component.Category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 dark:text-white">{component.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
            {currentVariation?.previewHtml ? (
              <div 
                dangerouslySetInnerHTML={{ __html: currentVariation.previewHtml }}
                className="w-full"
              />
            ) : (
              <div className="text-gray-400">No preview available</div>
            )}
          </div>
          
          {component.Variations && component.Variations.length > 1 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {component.Variations.map((variation, index) => (
                <button
                  key={variation.id}
                  onClick={() => setActiveVariation(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeVariation === index
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  {variation.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {component.name}
              </h1>
              <div className="flex gap-2 flex-wrap">
                {component.Category && (
                  <Link
                    to={`/gallery?category=${component.Category.id}`}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                  >
                    {component.Category.name}
                  </Link>
                )}
                {component.Style && (
                  <Link
                    to={`/styles`}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    {component.Style.name}
                  </Link>
                )}
                {component.Tags?.map(tag => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {component.description}
          </p>

          <div className="flex gap-3 mb-8">
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-red-100 dark:bg-red-900 text-red-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <HeartIcon filled={isFavorite} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            
            <button
              onClick={() => setCodeView(codeView === 'html' ? 'react' : 'html')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <CodeIcon />
              {codeView === 'html' ? 'View React' : 'View HTML'}
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Code
            </h3>
            <CodeViewer
              code={codeView === 'html' 
                ? currentVariation?.codeHtml || '' 
                : currentVariation?.codeReact || ''
              }
              language={codeView === 'html' ? 'html' : 'jsx'}
            />
          </div>

          {component.Variations && component.Variations[activeVariation]?.cssCode && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                CSS
              </h3>
              <CodeViewer
                code={currentVariation.cssCode}
                language="css"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
