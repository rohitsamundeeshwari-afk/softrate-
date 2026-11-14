import React from 'react';
import {
  Code,
  Cpu,
  Globe,
  Zap,
  Shield,
  Cloud,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react';

const iconMap = {
  'Software Development': Code,
  'Artificial Intelligence & Machine Learning': Cpu,
  'Web and Mobile App Development': Globe,
  'Technology & Innovation': Zap,
  'Cybersecurity': Shield,
  'Cloud Computing': Cloud,
  'Industry Insights': TrendingUp,
};

export default function CategoryFilter({
  categories = [],
  selectedCategory,
  onSelectCategory,
  totalPostsCount = 0,
}) {
  return (
    <div id="categories-section" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Filter by Category
        </h2>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 flex-wrap">
        {/* All Posts button */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-slate-900/10 scale-[1.02]'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>All Topics</span>
          {totalPostsCount > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalPostsCount}
            </span>
          )}
        </button>

        {/* Dynamic Category buttons */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug || selectedCategory === cat.name;
          const IconComponent = iconMap[cat.name] || LayoutGrid;

          return (
            <button
              key={cat._id || cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-teal-600/20 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <IconComponent className="w-4 h-4 opacity-80" />
              <span>{cat.name}</span>
              {cat.postCount !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-teal-700 text-teal-100'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.postCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
