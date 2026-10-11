import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white text-stone-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand & mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-white">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold text-[#163829]">
                Seat & Serve
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-500">
              Smart Restaurant Reservation, Queue and Food Order Coordination System. Connecting dining reservations, advance kitchen ticketing, and real-time waiting lists.
            </p>
            <div className="text-[11px] text-stone-400">
              Academic Capstone Project &middot; Full-Stack Ready (Spring Boot & MySQL Architecture)
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Platform Features
            </p>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link to="/menu" className="hover:text-[#1B4332] transition-colors">
                  Artisanal Food Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-[#1B4332] transition-colors">
                  Table Reservation System
                </Link>
              </li>
              <li>
                <Link to="/queue" className="hover:text-[#1B4332] transition-colors">
                  Live Queue & Wait Estimator
                </Link>
              </li>
              <li>
                <Link to="/orders/track" className="hover:text-[#1B4332] transition-colors">
                  Kitchen Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/cancellation" className="hover:text-[#1B4332] transition-colors">
                  Cancellation & Waitlist Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating hours */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Dining Hours
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[#1B4332] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-800">Lunch Service</p>
                  <p className="text-stone-500">11:30 AM &ndash; 03:45 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="h-4 w-4 text-[#1B4332] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-800">Dinner Service</p>
                  <p className="text-stone-500">07:00 PM &ndash; 11:30 PM</p>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 pt-1">Open 7 days a week including public holidays.</p>
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Location & Contact
            </p>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C85A32] shrink-0 mt-0.5" />
                <span className="text-stone-600 leading-relaxed">
                  100 Feet Road, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#1B4332] shrink-0" />
                <span className="text-stone-600 tabular-nums">+91 80 4912 8800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1B4332] shrink-0" />
                <span className="text-stone-600">contact@seatandserve.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Seat &amp; Serve Hospitality Systems. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/cancellation" className="hover:text-stone-600">Cancellation Terms</Link>
            <span>&middot;</span>
            <Link to="/staff" className="hover:text-stone-600">Staff Portal</Link>
            <span>&middot;</span>
            <Link to="/admin" className="hover:text-stone-600">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
