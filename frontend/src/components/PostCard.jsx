import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Eye } from 'lucide-react';

const categoryColorStyles = {
  'Software Development': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  'Artificial Intelligence & Machine Learning': 'bg-purple-50 text-purple-700 border-purple-200/60',
  'Web and Mobile App Development': 'bg-blue-50 text-blue-700 border-blue-200/60',
  'Technology & Innovation': 'bg-amber-50 text-amber-700 border-amber-200/60',
  'Cybersecurity': 'bg-rose-50 text-rose-700 border-rose-200/60',
  'Cloud Computing': 'bg-sky-50 text-sky-700 border-sky-200/60',
  'Industry Insights': 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
};

export default function PostCard({ post }) {
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  const categoryStyle =
    categoryColorStyles[post.category] || 'bg-teal-50 text-teal-700 border-teal-200/60';

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      {/* Cover Image */}
      <Link
        to={`/posts/${post.slug || post._id}`}
        className="relative aspect-[16/9] overflow-hidden bg-slate-100 block"
      >
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md bg-white/95 ${categoryStyle}`}
          >
            {post.category}
          </span>
        </div>
        {post.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Meta Bar */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.readTime || 5} min read</span>
          </div>
          {post.views !== undefined && post.views > 0 && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views}</span>
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug mb-2">
          <Link to={`/posts/${post.slug || post._id}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {post.summary}
        </p>

        {/* Author & Read More */}
        <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={
                post.authorAvatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
              }
              alt={post.author || 'Author'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 line-clamp-1">{post.author || 'Rohit'}</p>
            </div>
          </div>

          <Link
            to={`/posts/${post.slug || post._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:text-teal-700 transition-colors"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
