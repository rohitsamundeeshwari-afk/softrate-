import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import PostCard from '../components/PostCard';
import FeaturedPost from '../components/FeaturedPost';
import { Loader2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch posts whenever search or category changes
  useEffect(() => {
    let isCurrent = true;
    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getPosts({
          search: searchTerm,
          category: selectedCategory === 'all' ? '' : selectedCategory,
          publishedOnly: true,
          limit: 20,
        });
        if (isCurrent && res.success) {
          setPosts(res.posts);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || 'Failed to fetch articles');
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      loadPosts();
    }, 200);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchTerm]);

  // Determine featured post (first featured post or first post if no filter/search)
  const isFiltering = selectedCategory !== 'all' || searchTerm.trim().length > 0;
  const featuredArticle = !isFiltering && posts.length > 0 ? (posts.find((p) => p.featured) || posts[0]) : null;
  const gridArticles = featuredArticle
    ? posts.filter((p) => (p._id || p.slug) !== (featuredArticle._id || featuredArticle.slug))
    : posts;

  return (
    <div className="min-h-screen">
      {/* Hero Welcome Banner */}
      <section className="pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Stack Technology & Engineering Publication</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Deep dives into code, cloud architectures, & emerging intelligence.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Curated articles covering modern software engineering, AI/ML models, scalable cloud systems, and industry insights.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Category Navigation Pills */}
        <div className="mb-10">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            totalPostsCount={posts.length}
          />
        </div>

        {/* Featured Post Banner (visible on default home view) */}
        {!isFiltering && featuredArticle && !isLoading && (
          <FeaturedPost post={featuredArticle} />
        )}

        {/* Section Header for Post Grid */}
        <div id="latest-articles" className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              <span>
                {isFiltering
                  ? `Search Results ${searchTerm ? `for "${searchTerm}"` : ''}`
                  : 'Latest Articles'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading technology articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="my-10 p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <h3 className="font-bold text-base">Unable to load articles</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !error && gridArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gridArticles.map((post) => (
              <PostCard key={post._id || post.slug} post={post} />
            ))}
          </div>
        )}

        {/* Empty Search/Filter State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              We couldn't find any articles matching your search query or selected category.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
