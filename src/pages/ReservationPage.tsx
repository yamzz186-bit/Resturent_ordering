import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { SeatingSection, Reservation } from '../types';
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const TIME_SLOTS = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

const SEATING_PREFERENCES: SeatingSection[] = [
  'Main Dining Hall',
  'Outdoor Terrace',
  'Window View',
  'Private Booth',
];

export const ReservationPage: React.FC = () => {
  const {
    currentUser,
    createReservation,
    cancelReservation,
    tables,
    reservations,
    getAvailableTablesForParty,
  } = useRestaurant();

  const navigate = useNavigate();

  // Form states
  const todayStr = new Date().toISOString().substring(0, 10);
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('13:30');
  const [partySize, setPartySize] = useState(4);
  const [seatingPreference, setSeatingPreference] = useState<SeatingSection>('Main Dining Hall');
  const [specialRequests, setSpecialRequests] = useState('');
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);

  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check matching tables for currently chosen parameters
  const candidateTables = getAvailableTablesForParty(partySize, date, timeSlot);
  const hasAvailableTable = candidateTables.length > 0;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerPhone) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    const booking = createReservation({
      customerName,
      customerPhone,
      customerEmail,
      date,
      timeSlot,
      partySize,
      seatingPreference,
      specialRequests: specialRequests.trim() || undefined,
    });

    if (booking) {
      setConfirmedBooking(booking);
    } else {
      setErrorMessage(`No suitable table available for ${partySize} guests at ${timeSlot} on ${date}. Please choose another time slot or join the live queue.`);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to cancel reservation ${bookingId}?`)) {
      cancelReservation(bookingId, 'Customer requested cancellation via portal');
      setConfirmedBooking(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
          Reserve a Table
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Guaranteed table reservations with intelligent capacity conflict checks and optional advance meal synchronization.
        </p>
      </div>

      {confirmedBooking ? (
        /* Confirmation Screen */
        <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Booking Confirmed
              </span>
              <h2 className="font-display text-xl font-bold text-stone-900">
                Reservation Reference #{confirmedBooking.id}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100 text-xs">
            <div>
              <span className="text-stone-400 block">Date</span>
              <span className="font-semibold text-stone-900">{confirmedBooking.date}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Time Slot</span>
              <span className="font-semibold text-stone-900">{confirmedBooking.timeSlot}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Party Size</span>
              <span className="font-semibold text-stone-900">{confirmedBooking.partySize} Guests</span>
            </div>
            <div>
              <span className="text-stone-400 block">Assigned Table</span>
              <span className="font-semibold text-[#1B4332]">
                {confirmedBooking.assignedTableId ? `Table ${confirmedBooking.assignedTableId}` : 'Allocated'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
            <p>
              <strong>Guest:</strong> {confirmedBooking.customerName} &middot; {confirmedBooking.customerPhone}
            </p>
            <p>
              <strong>Seating Area:</strong> {confirmedBooking.seatingPreference}
            </p>
            {confirmedBooking.specialRequests && (
              <p>
                <strong>Requests:</strong> &ldquo;{confirmedBooking.specialRequests}&rdquo;
              </p>
            )}
          </div>

          {/* Action cards: Advance order or Cancel */}
          <div className="space-y-3 pt-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <UtensilsCrossed className="h-4 w-4 text-[#C85A32]" />
                  Pre-Order Your Food Ahead of Time
                </p>
                <p className="text-[11px] text-emerald-800">
                  Cut table waiting time to zero by pre-ordering your food for this booking.
                </p>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-1 rounded-lg bg-[#1B4332] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#25553E] whitespace-nowrap"
              >
                <span>Browse Menu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                &larr; Make another booking
              </button>

              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50"
                >
                  View in My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => handleCancelBooking(confirmedBooking.id)}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Reservation Booking Form */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-8">
            {errorMessage && (
              <div className="mb-5 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6 text-xs">
              {/* Row 1: Date & Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-[#1B4332]" />
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#1B4332]" />
                    Party Size (Number of Guests)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="flex-1 accent-[#1B4332]"
                    />
                    <span className="w-16 rounded-md bg-stone-100 py-1.5 text-center font-bold text-stone-900 tabular-nums">
                      {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Time Slots */}
              <div>
                <label className="block font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#1B4332]" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = timeSlot === slot;
                    // Check availability for this slot
                    const availForSlot = getAvailableTablesForParty(partySize, date, slot).length > 0;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`rounded-lg py-2 px-2 text-xs font-semibold tabular-nums border transition-all ${
                          isSelected
                            ? 'border-[#1B4332] bg-[#1B4332] text-white shadow-xs'
                            : availForSlot
                            ? 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                            : 'border-stone-100 bg-stone-100 text-stone-400 line-through'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Seating Preference */}
              <div>
                <label className="block font-semibold text-stone-700 mb-2">
                  Seating Area Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SEATING_PREFERENCES.map((pref) => {
                    const isSelected = seatingPreference === pref;
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setSeatingPreference(pref)}
                        className={`rounded-lg p-2.5 text-xs font-medium border text-center transition-colors ${
                          isSelected
                            ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332] font-semibold'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-stone-100 pt-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Occasion or Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Birthday anniversary, high chair needed, wheelchair accessible seating..."
                  rows={2}
                  className="w-full rounded-lg border border-stone-200 p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!hasAvailableTable}
                  className={`w-full rounded-lg py-3 text-xs font-semibold text-white shadow-xs transition-colors flex items-center justify-center gap-2 ${
                    hasAvailableTable
                      ? 'bg-[#1B4332] hover:bg-[#25553E]'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {hasAvailableTable
                      ? `Confirm Reservation (${partySize} Guests · ${timeSlot})`
                      : 'No Tables Available for This Slot'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Table Status & Policy */}
          <div className="space-y-4 lg:col-span-4">
            {/* Live slot capacity indicator */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Slot Availability Status
              </h3>
              <div className="rounded-lg bg-stone-50 p-3 text-xs space-y-2 border border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Matching Tables</span>
                  <span className="font-bold tabular-nums text-stone-900">
                    {candidateTables.length} table(s) ready
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Slot Duration</span>
                  <span className="font-medium text-stone-800">90 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Table Release</span>
                  <span className="font-medium text-stone-800">15 min grace period</span>
                </div>
              </div>

              {!hasAvailableTable && (
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-700" />
                    High Demand Slot
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    All tables matching your party size are booked. You can join the{' '}
                    <Link to="/queue" className="underline font-semibold text-[#1B4332]">
                      Live Walk-in Queue
                    </Link>{' '}
                    or try another time slot.
                  </p>
                </div>
              )}
            </div>

            {/* Reservation Policy Note */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-2 text-xs text-stone-500">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Cancellation &amp; Waitlist Rules
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 leading-relaxed text-[11px]">
                <li>Free cancellation anytime prior to 60 minutes before your slot.</li>
                <li>When a reservation is cancelled, the released table is automatically offered to waiting walk-in guests.</li>
                <li>Advance food orders can be tracked in real-time in the Kitchen Dashboard.</li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/cancellation"
                  className="text-[11px] font-semibold text-[#1B4332] hover:underline"
                >
                  View Full Cancellation Policy &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
