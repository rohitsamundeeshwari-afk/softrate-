import React from 'react';
import { Terminal, Github, Twitter, Linkedin, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TechPulse</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A modern Full Stack Technology Blog built with the complete MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with utility-first Tailwind CSS.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-teal-400 border border-slate-700/60">
                MongoDB
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700/60">
                Express.js
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700/60">
                React.js
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-green-400 border border-slate-700/60">
                Node.js
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-slate-800 text-sky-400 border border-slate-700/60">
                Tailwind CSS
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore Topics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#latest-articles" className="hover:text-teal-400 transition-colors">
                  Software Development
                </a>
              </li>
              <li>
                <a href="#latest-articles" className="hover:text-teal-400 transition-colors">
                  Artificial Intelligence & ML
                </a>
              </li>
              <li>
                <a href="#latest-articles" className="hover:text-teal-400 transition-colors">
                  Web & Mobile App Dev
                </a>
              </li>
              <li>
                <a href="#latest-articles" className="hover:text-teal-400 transition-colors">
                  Cloud Computing
                </a>
              </li>
              <li>
                <a href="#latest-articles" className="hover:text-teal-400 transition-colors">
                  Cybersecurity
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & System */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Admin & CMS
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  <span>CMS Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/posts/new" className="hover:text-teal-400 transition-colors">
                  Publish New Article
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className="hover:text-teal-400 transition-colors">
                  Manage Categories
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-teal-400 transition-colors">
                  Admin Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TechPulse MERN Blog. Designed and engineered by Rohit.</p>
          <div className="flex items-center gap-1">
            <span>Built with clean code &</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for high-performance full-stack learning.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
