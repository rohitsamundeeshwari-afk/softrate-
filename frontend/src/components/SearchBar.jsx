import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search articles, topics, or authors...' }) {
  const quickSearches = ['AI', 'React', 'Node.js', 'Kubernetes', 'Zero Trust', 'Microservices'];

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm transition-all text-sm sm:text-base"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 p-0.5 rounded-full hover:bg-slate-100" />
          </button>
        )}
      </div>

      {/* Suggested Quick Search Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs text-slate-500 pb-1">
        <span className="font-medium shrink-0">Popular:</span>
        {quickSearches.map((term) => (
          <button
            key={term}
            onClick={() => onChange(term)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors border border-slate-200/60"
          >
            #{term}
          </button>
        ))}
      </div>
    </div>
  );
}
