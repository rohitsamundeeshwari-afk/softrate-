import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Check,
  Tag,
  Loader2,
  AlertCircle,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import PostCard from '../components/PostCard';

export default function BlogDetailPage() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadPost() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getPost(idOrSlug);
        if (res.success && res.post) {
          setPost(res.post);

          // Fetch related posts from same category
          if (res.post.category) {
            const related = await api.getPosts({
              category: res.post.category,
              limit: 3,
            });
            if (related.success) {
              setRelatedPosts(
                related.posts.filter((p) => (p._id || p.slug) !== (res.post._id || res.post.slug))
              );
            }
          }
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load article');
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [idOrSlug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper to format content with sections, code blocks, and markdown-like styles
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const blocks = content.split('\n\n');

    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-10 mb-4 tracking-tight"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Code Block
      if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
        const lines = trimmed.split('\n');
        const language = lines[0].replace('```', '') || 'code';
        const code = lines.slice(1, -1).join('\n');
        return (
          <div key={idx} className="my-6 rounded-2xl overflow-hidden bg-slate-950 text-slate-200 border border-slate-800 shadow-md">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{language}</span>
              <span>Syntax Preview</span>
            </div>
            <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-teal-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter((item) => /^\d+\.\s/.test(item.trim()));
        return (
          <ol key={idx} className="list-decimal pl-6 my-4 space-y-2 text-slate-700 leading-relaxed text-base sm:text-lg">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
            ))}
          </ol>
        );
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter((item) => item.trim().startsWith('- ') || item.trim().startsWith('* '));
        return (
          <ul key={idx} className="list-disc pl-6 my-4 space-y-2 text-slate-700 leading-relaxed text-base sm:text-lg">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s/, '')}</li>
            ))}
          </ul>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="my-6 pl-5 border-l-4 border-teal-500 italic text-slate-700 bg-teal-50/50 p-4 rounded-r-xl"
          >
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }

      // Standard Paragraph
      return (
        <p
          key={idx}
          className="text-slate-700 leading-relaxed text-base sm:text-lg mb-4 selection:bg-teal-100"
        >
          {trimmed}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6">
          The requested article may have been removed or the link is incorrect.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently Published';

  return (
    <article className="min-h-screen pb-24">
      {/* Top Navigation & Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-teal-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Category Pill */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
            {post.category}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt / Summary Lead */}
        <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 border-l-4 border-teal-500 pl-4 py-1 italic bg-slate-50 rounded-r-xl">
          {post.summary}
        </p>

        {/* Author & Meta Details Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-200 mb-8">
          <div className="flex items-center gap-3.5">
            <img
              src={
                post.authorAvatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/30"
            />
            <div>
              <div className="font-bold text-slate-900 text-sm sm:text-base">{post.author}</div>
              <div className="text-xs text-slate-500">{post.authorRole || 'Engineering Contributor'}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{post.readTime || 5} min read</span>
            </div>
            {post.views !== undefined && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{post.views} views</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 mb-10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Full Formatted Article Content */}
        <div className="prose prose-slate prose-lg max-w-none">
          {renderFormattedContent(post.content)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
                Tagged Topics:
              </span>
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={
              post.authorAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            }
            alt={post.author}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-500 shadow-sm shrink-0"
          />
          <div className="text-center sm:text-left space-y-1.5">
            <h4 className="font-bold text-slate-900 text-base">Written by {post.author}</h4>
            <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider">
              {post.authorRole || 'Principal Architect & Tech Writer'}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Passionate about high-throughput software architectures, AI systems, and creating clean, maintainable open-source software for the community.
            </p>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              More in {post.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <PostCard key={rel._id || rel.slug} post={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
