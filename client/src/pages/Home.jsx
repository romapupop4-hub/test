import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ComponentCard from '../components/ComponentCard';
import CategoryCard from '../components/CategoryCard';
import StyleCard from '../components/StyleCard';
import { GridIcon, ArrowRightIcon, StarIcon, SparklesIcon, FireIcon } from '../components/Icons';

export default function Home() {
  const [featuredComponents, setFeaturedComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [componentsRes, categoriesRes, stylesRes] = await Promise.all([
          api.get('/components?featured=true&limit=8'),
          api.get('/categories?limit=8'),
          api.get('/styles?limit=6')
        ]);
        setFeaturedComponents(componentsRes.data.components || []);
        setCategories(categoriesRes.data.categories || []);
        setStyles(stylesRes.data.styles || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <SparklesIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">200+ UI Components Available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Premium UI Asset
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Discover, preview, and copy premium UI components, styles, and design patterns. 
              Build beautiful interfaces faster with our curated collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                <GridIcon className="w-5 h-5" />
                Browse Gallery
              </Link>
              <Link
                to="/styles"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
              >
                <FireIcon className="w-5 h-5" />
                Explore Styles
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Featured Components
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Hand-picked premium components ready to copy and use
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredComponents.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all"
            >
              View All Components
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Find exactly what you need with our organized categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all"
            >
              All Categories
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Design Styles
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Explore different visual approaches and aesthetics
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {styles.map((style) => (
              <StyleCard key={style.id} style={style} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/styles"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all"
            >
              All Styles
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who use our UI assets to build amazing products.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            <StarIcon className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
