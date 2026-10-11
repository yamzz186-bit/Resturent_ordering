import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { DishCard } from '../components/menu/DishCard';
import {
  CalendarDays,
  Clock,
  UtensilsCrossed,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { menuItems } = useRestaurant();

  // Top popular dishes
  const popularDishes = menuItems
    .filter((d) => d.rating >= 4.8 && d.isAvailable)
    .slice(0, 4);

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left text column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-3 py-1 text-xs font-medium text-[#1B4332] shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-[#C85A32]" />
                <span>Next-Generation Restaurant Dining Coordination</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl leading-[1.1] max-w-2xl">
                Your Table. <br />
                Your Food. <br />
                <span className="text-[#1B4332]">Your Time.</span>
              </h1>

              <p className="max-w-xl text-base text-stone-600 sm:text-lg leading-relaxed">
                Seat &amp; Serve connects table reservations, advance kitchen orders, custom spice levels, and live waitlist tracking into one seamless platform. No waiting at the door, no delays at your table.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/reservations"
                  className="flex items-center gap-2 rounded-lg bg-[#1B4332] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#25553E] transition-all"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Book a Table</span>
                </Link>

                <Link
                  to="/menu"
                  className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 transition-all"
                >
                  <UtensilsCrossed className="h-4 w-4 text-[#C85A32]" />
                  <span>Explore Menu &amp; Pre-Order</span>
                </Link>

                <Link
                  to="/queue"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-stone-600 hover:text-[#1B4332] transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Check Live Queue</span>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-3 gap-6 border-t border-stone-200/80 pt-6 text-xs text-stone-500">
                <div>
                  <p className="font-display text-lg font-bold text-stone-900 tabular-nums">0 min</p>
                  <p className="mt-0.5">Wait when pre-ordered</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-stone-900 tabular-nums">100%</p>
                  <p className="mt-0.5">Live queue transparency</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-stone-900 tabular-nums">4.9 ★</p>
                  <p className="mt-0.5">Guest satisfaction rating</p>
                </div>
              </div>
            </div>

            {/* Right visual card showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
                {/* Dining room preview */}
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                    alt="Seat and Serve Restaurant Ambience"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs uppercase tracking-wider text-stone-300">Indiranagar, Bengaluru</p>
                    <p className="font-display text-base font-bold">Main Dining Room &amp; Garden Terrace</p>
                  </div>
                </div>

                {/* Live simulation feature preview strip */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3 text-xs border border-stone-100">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1B4332] text-white">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">Current Waitlist</p>
                        <p className="text-stone-500 text-[11px]">4 groups waiting &middot; ~15 mins</p>
                      </div>
                    </div>
                    <Link
                      to="/queue"
                      className="text-[#1B4332] font-semibold hover:underline text-[11px] flex items-center gap-1"
                    >
                      Join Queue <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-[#FAF8F5] p-3 text-xs border border-stone-100">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C85A32] text-white">
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">Advance Kitchen Sync</p>
                        <p className="text-stone-500 text-[11px]">Food preps before you arrive</p>
                      </div>
                    </div>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Frictionless Dining Flow
          </p>
          <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
            How Seat &amp; Serve Works
          </h2>
          <p className="text-sm text-stone-600">
            Four coordinated steps that bridge front-of-house hospitality and backend kitchen execution.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs">
            <span className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">01</span>
            <h3 className="font-display font-bold text-stone-900 text-base">Book or Queue</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pick your exact date, time slot, and seating preference (Outdoor Terrace, Window, or Booth), or join the live digital walk-in queue.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs">
            <span className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">02</span>
            <h3 className="font-display font-bold text-stone-900 text-base">Pre-Order Food</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse our authentic menu, customize spice levels and portion sizes, and link your cart directly to your confirmed table reservation.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs">
            <span className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">03</span>
            <h3 className="font-display font-bold text-stone-900 text-base">Kitchen Synchronizes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Staff and chefs start meal preparation timed precisely to your arrival, so hot dishes are ready shortly after you take your seat.
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-3 shadow-2xs">
            <span className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">04</span>
            <h3 className="font-display font-bold text-stone-900 text-base">Smart Reassignment</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              If a reservation cancels, the system automatically detects eligible walk-in waitlist parties and offers the released table immediately.
            </p>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES */}
      <section className="bg-stone-100/60 py-16 border-y border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              Coordination Technology
            </p>
            <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
              Engineered for Guests &amp; Restaurant Staff
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B4332]/10 text-[#1B4332]">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-stone-900 text-sm">Table Availability Logic</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Prevents double bookings by cross-referencing party size against actual table capacities and slot durations.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C85A32]/10 text-[#C85A32]">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-stone-900 text-sm">Live Queue Estimator</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Calculates wait times transparently using table turnover averages, party size matching, and active dining states.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B4332]/10 text-[#1B4332]">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-stone-900 text-sm">Kitchen Kanban Tracking</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Status transitions (Placed &rarr; Preparing &rarr; Ready &rarr; Served) instantly sync with the customer tracking screen.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C85A32]/10 text-[#C85A32]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-stone-900 text-sm">Waitlist Reassignment</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Cancelled slots are protected and offered to next eligible waitlist party with an expiry countdown timer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DISHES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Chef's Signatures
            </p>
            <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl mt-1">
              Popular Dishes Ready for Pre-Order
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Cooked with artisanal spices, slow dum traditions, and premium ingredients.
            </p>
          </div>
          <Link
            to="/menu"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:underline whitespace-nowrap"
          >
            <span>View Complete Menu</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 md:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              Verified Diner Feedback
            </p>
            <h3 className="font-display text-2xl font-bold text-stone-900">
              Why Guests Love Seat &amp; Serve
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-[#FAF8F5] p-5 space-y-3 border border-stone-100">
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Pre-ordering our Hyderabadi Mutton Biryani meant hot, fragrant handis arrived 8 minutes after seating. Our anniversary lunch was completely stress-free.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-200/60">
                <p className="text-xs font-semibold text-stone-900">Devansh Verma</p>
                <p className="text-[11px] text-stone-500">Regular Weekend Guest &middot; Indiranagar</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#FAF8F5] p-5 space-y-3 border border-stone-100">
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;We walked in without a booking on Friday night. The Live Queue estimator showed 15 minutes, accurately predicted our table, and we received a prompt notification.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-200/60">
                <p className="text-xs font-semibold text-stone-900">Priya Nambiar</p>
                <p className="text-[11px] text-stone-500">Walk-in Diner</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#FAF8F5] p-5 space-y-3 border border-stone-100">
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;As restaurant managers, having cancellation reassignments automatically offer freed slots to our waitlist guests has raised our table turnover by 30%.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-200/60">
                <p className="text-xs font-semibold text-stone-900">Pooja Iyer</p>
                <p className="text-[11px] text-stone-500">Head Hostess &middot; Seat &amp; Serve Staff</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="rounded-2xl bg-[#1B4332] p-8 text-white md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              Ready for a Flawless Dining Experience?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Reserve your preferred table, pre-order handcrafted dishes, and enjoy your time with friends and family without waiting.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/reservations"
              className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#1B4332] shadow-sm hover:bg-stone-100 transition-colors"
            >
              Reserve a Table Now
            </Link>
            <Link
              to="/menu"
              className="rounded-lg border border-white/30 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
