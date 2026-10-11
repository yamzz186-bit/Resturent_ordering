import React, { useState } from 'react';
import { MenuItem, MenuItemAddon, PortionSize, SpiceLevel } from '../../types';
import { DishImage } from '../common/DishImage';
import { X, Clock, Star, Flame, Plus, Minus, Check } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface DishCustomizationModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export const DishCustomizationModal: React.FC<DishCustomizationModalProps> = ({ dish, onClose }) => {
  const { addToCart } = useRestaurant();

  if (!dish) return null;

  const [portionSize, setPortionSize] = useState<PortionSize>(
    dish.hasPortionSizes ? 'Full' : 'Regular'
  );
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(
    dish.defaultSpiceLevel || 'Medium'
  );
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate unit price dynamically
  const basePrice = dish.price;
  const portionMultiplier = portionSize === 'Half' ? 0.65 : 1.0;
  const portionAdjustedBase = Math.round(basePrice * portionMultiplier);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = portionAdjustedBase + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: MenuItemAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    const success = addToCart(
      dish,
      {
        portionSize: dish.hasPortionSizes ? portionSize : undefined,
        spiceLevel: dish.spiceLevelOptions ? spiceLevel : undefined,
        selectedAddons,
        specialInstructions: specialInstructions.trim() || undefined,
        unitPrice,
      },
      quantity
    );

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
      >
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Dish Imagery */}
        <div className="relative h-48 w-full shrink-0">
          <DishImage
            src={dish.image}
            alt={dish.name}
            category={dish.category}
            aspectRatioClass="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              {/* Veg / Non-veg icon */}
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-xs border p-0.5 bg-white ${
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
              <span className="text-xs uppercase tracking-wider text-stone-200">
                {dish.category}
              </span>
            </div>
            <h2 id="dish-modal-title" className="font-display text-lg font-bold leading-snug">
              {dish.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Description & metadata */}
          <div>
            <p className="text-xs text-stone-600 leading-relaxed">{dish.description}</p>
            <div className="mt-2.5 flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1 font-semibold text-stone-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {dish.rating} <span className="font-normal text-stone-500">({dish.reviewCount})</span>
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                ~{dish.prepTimeMinutes} mins prep
              </span>
            </div>
          </div>

          {/* Portion Size */}
          {dish.hasPortionSizes && (
            <div className="border-t border-stone-100 pt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Portion Size
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {(['Half', 'Full'] as PortionSize[]).map((size) => {
                  const isSelected = portionSize === size;
                  const price = size === 'Half' ? Math.round(dish.price * 0.65) : dish.price;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPortionSize(size)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                        isSelected
                          ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332] font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span>{size} Portion</span>
                      <span className="tabular-nums text-xs">₹{price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {dish.spiceLevelOptions && dish.spiceLevelOptions.length > 0 && (
            <div className="border-t border-stone-100 pt-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Spice Level
                </label>
                <span className="text-xs text-stone-500">Customized to taste</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {dish.spiceLevelOptions.map((level) => {
                  const isSelected = spiceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSpiceLevel(level)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        isSelected
                          ? 'border-[#C85A32] bg-[#C85A32]/10 text-[#C85A32] font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <Flame className={`h-3 w-3 ${isSelected ? 'text-[#C85A32]' : 'text-stone-400'}`} />
                      <span>{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {dish.availableAddons && dish.availableAddons.length > 0 && (
            <div className="border-t border-stone-100 pt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                Recommended Add-ons &amp; Extras
              </label>
              <div className="mt-2 space-y-2">
                {dish.availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-colors ${
                        isChecked
                          ? 'border-[#1B4332] bg-[#1B4332]/5'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isChecked
                              ? 'border-[#1B4332] bg-[#1B4332] text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs text-stone-800">{addon.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 tabular-nums">
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div className="border-t border-stone-100 pt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Kitchen Notes &amp; Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Less oil, no onions, extra crunchy, serve first..."
              rows={2}
              maxLength={150}
              className="mt-1.5 w-full rounded-lg border border-stone-200 p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:border-[#1B4332] focus:outline-hidden"
            />
            <p className="mt-1 text-[11px] text-stone-400">
              Our chefs will do their best to accommodate your preferences.
            </p>
          </div>
        </div>

        {/* Modal Footer with quantity & dynamic price */}
        <div className="border-t border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-lg border border-stone-300 bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold tabular-nums text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Total and Add button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-between rounded-lg bg-[#1B4332] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E] transition-colors"
            >
              <span>Add to Cart</span>
              <span className="tabular-nums font-bold text-sm">₹{totalPrice}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
