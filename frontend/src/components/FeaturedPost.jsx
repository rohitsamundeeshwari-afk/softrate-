import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';

export default function FeaturedPost({ post }) {
  if (!post) return null;

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl mb-12 border border-slate-700/50">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Text */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Editor's Featured Story
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {post.category}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight hover:text-teal-300 transition-colors">
            <Link to={`/posts/${post.slug || post._id}`}>{post.title}</Link>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {post.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <img
                src={
                  post.authorAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                }
                alt={post.author}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/40"
              />
              <span className="font-medium text-white">{post.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to={`/posts/${post.slug || post._id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Cover Image */}
        <div className="lg:col-span-5">
          <Link
            to={`/posts/${post.slug || post._id}`}
            className="block relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </Link>
        </div>
      </div>
    </section>
  );
}
