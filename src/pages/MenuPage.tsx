import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { DishCard } from '../components/menu/DishCard';
import { DishCategory } from '../types';
import { Search, SlidersHorizontal, UtensilsCrossed, Sparkles } from 'lucide-react';

const CATEGORIES: ('All' | DishCategory)[] = [
  'All',
  'Starters',
  'Main Course',
  'Biryani',
  'Pizza',
  'Burgers',
  'Desserts',
  'Beverages',
];

export const MenuPage: React.FC = () => {
  const { menuItems } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | DishCategory>('All');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'prep-time'>('popular');

  // Filter and sort items
  const filteredDishes = useMemo(() => {
    return menuItems
      .filter((dish) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dish.name.toLowerCase().includes(q);
          const matchDesc = dish.description.toLowerCase().includes(q);
          const matchCategory = dish.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCategory) return false;
        }

        // Category
        if (selectedCategory !== 'All' && dish.category !== selectedCategory) {
          return false;
        }

        // Diet filter
        if (dietFilter === 'veg' && !dish.isVegetarian) return false;
        if (dietFilter === 'non-veg' && dish.isVegetarian) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
        }
        if (sortBy === 'price-low') {
          return a.price - b.price;
        }
        if (sortBy === 'price-high') {
          return b.price - a.price;
        }
        if (sortBy === 'prep-time') {
          return a.prepTimeMinutes - b.prepTimeMinutes;
        }
        return 0;
      });
  }, [menuItems, searchQuery, selectedCategory, dietFilter, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Subtitle */}
      <div className="border-b border-stone-200/80 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Handcrafted Culinary Selections
            </span>
            <h1 className="font-display text-3xl font-extrabold text-stone-900 sm:text-4xl mt-1">
              The Dining Menu
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              From charcoal-smoked clay oven starters to 24-hour slow-cooked gravies and royal dum biryanis. Pre-order online to coordinate instant serving upon your arrival.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5 font-medium text-stone-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600" /> Veg
            </span>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5 font-medium text-stone-800">
              <span className="h-2 w-2 rounded-full bg-rose-600" /> Non-Veg
            </span>
            <span>&middot;</span>
            <span className="tabular-nums font-semibold text-stone-900">
              {menuItems.filter((m) => m.isAvailable).length} Available Today
            </span>
          </div>
        </div>
      </div>

      {/* Search, Filter Bar, and Diet Controls */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Biryani, Butter Chicken, Naan)..."
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-900 placeholder-stone-400 shadow-2xs focus:border-[#1B4332] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Diet and Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Diet segment */}
            <div className="flex items-center rounded-lg border border-stone-200 bg-white p-1 shadow-2xs">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  dietFilter === 'all'
                    ? 'bg-[#1B4332] text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Veg Only
              </button>
              <button
                onClick={() => setDietFilter('non-veg')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  dietFilter === 'non-veg'
                    ? 'bg-rose-700 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Non-Veg
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 shadow-2xs">
              <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-800 focus:outline-hidden text-xs font-medium cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="prep-time">Fastest Prep Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category horizontal tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-stone-800">
            No matching dishes found
          </h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms, selecting "All Diets", or resetting the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setDietFilter('all');
            }}
            className="mt-4 rounded-lg bg-[#1B4332] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
