import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Image,
  Tag,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  List,
  Heading,
  Quote,
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Software Architecture', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Neural Nets', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Web & React Code', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cybersecurity Shield', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Infrastructure', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Tech Matrix', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: '',
    author: 'Rohit Sharma',
    authorRole: 'Full Stack Engineer & Tech Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: PRESET_IMAGES[0].url,
    tags: 'React, Node.js, Web',
    readTime: 5,
    published: true,
    featured: false,
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch categories and existing post if editing
  useEffect(() => {
    async function init() {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) {
          setCategories(catRes.categories);
          if (!isEditing && catRes.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.categories[0].name }));
          }
        }

        if (isEditing) {
          const postRes = await api.getPost(id);
          if (postRes.success && postRes.post) {
            const p = postRes.post;
            setFormData({
              title: p.title || '',
              slug: p.slug || '',
              summary: p.summary || '',
              content: p.content || '',
              category: p.category || '',
              author: p.author || 'Rohit Sharma',
              authorRole: p.authorRole || 'Full Stack Engineer & Tech Lead',
              authorAvatar: p.authorAvatar || '',
              coverImage: p.coverImage || PRESET_IMAGES[0].url,
              tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
              readTime: p.readTime || 5,
              published: p.published !== false,
              featured: Boolean(p.featured),
            });
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize editor');
      } finally {
        setIsFetching(false);
      }
    }
    init();
  }, [id, isEditing]);

  // Auto generate slug when title changes in create mode
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isEditing
        ? title
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.slug,
    }));
  };

  const insertMarkdown = (snippet) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + snippet,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        readTime: Number(formData.readTime) || 5,
      };

      if (isEditing) {
        await api.updatePost(id, payload);
        setSuccessMsg('Article updated successfully!');
      } else {
        await api.createPost(payload);
        setSuccessMsg('Article published successfully!');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Edit Blog Article' : 'Create New Article'}
              </h1>
              <p className="text-xs text-slate-500">
                {isEditing ? `Editing: ${formData.slug}` : 'Draft or publish a new technical piece'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              {isPreview ? <Edit3 className="w-4 h-4 text-teal-600" /> : <Eye className="w-4 h-4 text-teal-600" />}
              <span>{isPreview ? 'Back to Editor' : 'Live Preview'}</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="font-semibold">{successMsg}</div>
          </div>
        )}

        {/* Live Preview Mode */}
        {isPreview ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                {formData.category || 'Category'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {formData.title || 'Untitled Article'}
            </h1>
            <p className="text-lg text-slate-600 border-l-4 border-teal-500 pl-4 py-1 italic mb-6">
              {formData.summary || 'Summary preview goes here...'}
            </p>
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Preview"
                className="w-full h-80 object-cover rounded-2xl mb-8 border border-slate-200"
              />
            )}
            <div className="prose prose-slate max-w-none whitespace-pre-line text-slate-700 leading-relaxed">
              {formData.content || 'Content will appear here...'}
            </div>
          </div>
        ) : (
          /* Editor Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Scaling Microservices with Node.js and Event-Driven Queues"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="scaling-microservices-with-nodejs"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Summary / Card Excerpt (1-2 sentences) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="A concise synopsis displayed on the homepage cards and article header..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                />
              </div>

              {/* Content with Markdown quick toolbar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Content (Markdown Supported) *
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n\n### Heading Title\n')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n\n```javascript\n// Code snippet here\n```\n')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-mono"
                    >
                      &lt;/&gt; Code
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n- Point item 1\n- Point item 2\n')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n> Important callout blockquote\n')}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold"
                    >
                      &ldquo; Quote
                    </button>
                  </div>
                </div>
                <textarea
                  rows={14}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article in depth. Use markdown syntax like ### Headings, ```code blocks```, and - bullet lists..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                />
              </div>

              {/* Cover Image Preset Picker & Custom URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Cover Image URL
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  />
                </div>
                {/* Presets */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-400 font-medium shrink-0">Presets:</span>
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: img.url })}
                      className={`shrink-0 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                        formData.coverImage === img.url
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Author Title / Role
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, AI, Cloud"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Status & Options Toggles */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    Publish immediately (uncheck to save as draft)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    Feature on Homepage Hero Banner
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : isEditing ? 'Update Article' : 'Publish Article'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
