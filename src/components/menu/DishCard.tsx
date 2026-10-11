import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { DishImage } from '../common/DishImage';
import { Clock, Star, Plus } from 'lucide-react';
import { DishCustomizationModal } from './DishCustomizationModal';

interface DishCardProps {
  dish: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* Top Image area */}
        <div className="relative overflow-hidden cursor-pointer" onClick={() => setModalOpen(true)}>
          <DishImage
            src={dish.image}
            alt={dish.name}
            category={dish.category}
            aspectRatioClass="aspect-[16/10]"
          />

          {/* Sold out banner if unavailable */}
          {!dish.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-2xs">
              <span className="rounded bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Sold Out Today
              </span>
            </div>
          )}

          {/* Quick tags */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {/* Veg / Non-veg symbol */}
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-xs border p-0.5 bg-white shadow-xs ${
                dish.isVegetarian ? 'border-emerald-600' : 'border-rose-600'
              }`}
              title={dish.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  dish.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </div>
            {dish.tags?.[0] && (
              <span className="rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                {dish.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => setModalOpen(true)}
              className="font-display font-bold text-stone-900 group-hover:text-[#1B4332] transition-colors cursor-pointer text-base line-clamp-1"
            >
              {dish.name}
            </h3>
          </div>

          <p className="mt-1.5 text-xs text-stone-500 leading-relaxed line-clamp-2">
            {dish.description}
          </p>

          {/* Prep time & Rating */}
          <div className="mt-3 flex items-center gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1 font-semibold text-stone-800">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{dish.rating}</span>
              <span className="font-normal text-stone-400 text-[11px]">({dish.reviewCount})</span>
            </div>
            <span>&middot;</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-stone-400" />
              <span className="tabular-nums">{dish.prepTimeMinutes}m prep</span>
            </div>
          </div>

          {/* Bottom price and action */}
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
            <div>
              <span className="text-[11px] text-stone-400 block">Price</span>
              <span className="font-display text-base font-bold text-stone-900 tabular-nums">
                ₹{dish.price}
              </span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              disabled={!dish.isAvailable}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                dish.isAvailable
                  ? 'bg-[#1B4332] text-white hover:bg-[#25553E] shadow-2xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{dish.hasPortionSizes || dish.availableAddons?.length ? 'Customize' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customization modal */}
      {modalOpen && (
        <DishCustomizationModal dish={dish} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
