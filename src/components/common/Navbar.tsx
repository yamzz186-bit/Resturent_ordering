import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShoppingBag, Menu as MenuIcon, X, UtensilsCrossed, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart, currentUser } = useRestaurant();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Reserve Table', href: '/reservations' },
    { label: 'Live Queue', href: '/queue' },
    { label: 'My Orders', href: '/orders/track' },
    ...(currentUser.role === 'staff'
      ? [{ label: 'Staff Console', href: '/staff' }]
      : currentUser.role === 'admin'
      ? [{ label: 'Admin Portal', href: '/admin' }]
      : [{ label: 'My Bookings', href: '/dashboard' }]),
  ];

  const isActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#163829] whitespace-nowrap shrink-0 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-white shadow-xs group-hover:bg-[#2D6A4F] transition-colors">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <span className="font-display tracking-tight text-xl font-bold text-[#163829]">
            Seat & Serve
          </span>
        </Link>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isActive(link.href)
                  ? 'text-[#163829] font-semibold border-b-2 border-[#163829] pb-0.5'
                  : 'hover:text-[#163829]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: 1 primary action & Bag */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/cart"
            className="relative flex items-center justify-center h-10 w-10 rounded-lg text-stone-700 hover:text-[#163829] hover:bg-stone-100 transition-colors"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C85A32] text-[11px] font-bold text-white tabular-nums shadow-xs">
                {totalCartCount}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-[#163829] hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <User className="h-3.5 w-3.5" />
            <span>{currentUser.name.split(' ')[0]}</span>
          </Link>

          <Link
            to="/reservations"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1B4332] rounded-lg hover:bg-[#25553E] transition-colors whitespace-nowrap shadow-xs"
          >
            Book Table
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in duration-150">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? 'bg-[#1B4332]/10 text-[#1B4332] font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md bg-stone-50 text-stone-800"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#C85A32]" />
                <span>Your Cart</span>
              </span>
              <span className="font-semibold tabular-nums">{totalCartCount} items</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
