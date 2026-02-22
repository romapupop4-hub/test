import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import ComponentCard from '../components/ComponentCard'

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('components')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/users/profile')
      setProfile(data.user || data)
      setFormData({
        name: data.user?.name || data.name || '',
        bio: data.user?.bio || data.bio || '',
        website: data.user?.website || data.website || ''
      })
      setComponents(data.components || [])
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put('/users/profile', formData)
      setProfile(data.user || data)
      setEditMode(false)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {profile?.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          
          <div className="flex-1">
            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile?.name || 'Your Profile'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                {profile?.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.bio}</p>
                )}
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {profile.website}
                  </a>
                )}
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('components')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'components'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Components ({components.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'components' ? (
        components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {components.map(component => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No components yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating and sharing your UI components
            </p>
            <a
              href="/gallery"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Gallery
            </a>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No recent activity
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your activity will appear here
          </p>
        </div>
      )}
    </div>
  )
}
