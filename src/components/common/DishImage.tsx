import React, { useState } from 'react';
import { UtensilsCrossed, Flame, Sparkles } from 'lucide-react';
import { DishCategory } from '../../types';

interface DishImageProps {
  src: string;
  alt: string;
  category?: DishCategory;
  className?: string;
  aspectRatioClass?: string;
}

export const DishImage: React.FC<DishImageProps> = ({
  src,
  alt,
  category = 'Main Course',
  className = '',
  aspectRatioClass = 'aspect-[4/3]',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback palette & icon based on category
  const getCategoryTheme = (cat: DishCategory) => {
    switch (cat) {
      case 'Biryani':
        return { bg: 'from-[#3D2612] to-[#1E4A38]', text: 'text-[#E5B574]' };
      case 'Starters':
        return { bg: 'from-[#421D12] to-[#2E3B2B]', text: 'text-[#E07A5F]' };
      case 'Desserts':
        return { bg: 'from-[#3E2229] to-[#2B352E]', text: 'text-[#F4A261]' };
      case 'Beverages':
        return { bg: 'from-[#19323F] to-[#1E4A38]', text: 'text-[#81C784]' };
      default:
        return { bg: 'from-[#1B3629] to-[#14261D]', text: 'text-[#C9A96E]' };
    }
  };

  const theme = getCategoryTheme(category);

  return (
    <div className={`relative overflow-hidden bg-[#EFECE6] ${aspectRatioClass} ${className}`}>
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Styled Fallback Container if image fails or while loading */}
      {(hasError || isLoading) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${theme.bg} p-4 text-center transition-opacity`}
        >
          <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ${theme.text}`}>
            {category === 'Biryani' || category === 'Starters' ? (
              <Flame className="h-6 w-6 stroke-[1.5]" />
            ) : category === 'Desserts' ? (
              <Sparkles className="h-6 w-6 stroke-[1.5]" />
            ) : (
              <UtensilsCrossed className="h-6 w-6 stroke-[1.5]" />
            )}
          </div>
          <p className="line-clamp-2 text-xs font-medium text-white/90">{alt}</p>
          <span className="mt-1 text-[10px] tracking-wider uppercase text-white/60">
            {category}
          </span>
        </div>
      )}
    </div>
  );
};
