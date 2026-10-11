import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B4332] text-white">
        <UtensilsCrossed className="h-7 w-7" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">
        Page Not Found
      </h1>
      <p className="mt-2 text-xs text-stone-500">
        The requested page does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-[#1B4332] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
      >
        Return to Home
      </Link>
    </div>
  );
};
