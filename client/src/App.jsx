import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Gallery from './pages/Gallery'
import ComponentDetail from './pages/ComponentDetail'
import Categories from './pages/Categories'
import Styles from './pages/Styles'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import UserProfile from './pages/UserProfile'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:categoryId" element={<Gallery />} />
                <Route path="/component/:id" element={<ComponentDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/styles" element={<Styles />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
