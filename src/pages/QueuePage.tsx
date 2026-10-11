import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { SeatingSection, QueueEntry } from '../types';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

const SEATING_SECTIONS: SeatingSection[] = [
  'Main Dining Hall',
  'Outdoor Terrace',
  'Window View',
  'Private Booth',
];

export const QueuePage: React.FC = () => {
  const {
    queue,
    joinQueue,
    leaveQueue,
    calculateQueueEstimation,
    tables,
    currentUser,
    activeSlotOffers,
    acceptSlotOffer,
    declineSlotOffer,
    addToast,
  } = useRestaurant();

  // Form states to join queue
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [partySize, setPartySize] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<SeatingSection>('Main Dining Hall');
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Check if current user is already in queue
  const myQueueEntry = queue.find(
    (q) =>
      q.customerPhone === currentUser.phone ||
      q.customerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  // My estimation
  const estimation = calculateQueueEstimation(partySize);

  // Filter queue lists
  const waitingEntries = queue.filter((q) => q.status === 'Waiting');
  const activeOffersForMe = activeSlotOffers.filter(
    (o) => myQueueEntry && o.queueId === myQueueEntry.id
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    joinQueue(customerName, customerPhone, partySize, seatingPreference);
    setShowJoinModal(false);
  };

  const handleLeave = (queueId: string) => {
    if (window.confirm('Are you sure you want to leave the live waitlist?')) {
      leaveQueue(queueId);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Real-Time Capacity Coordination
            </span>
            <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl mt-1">
              Live Waitlist &amp; Queue Estimator
            </h1>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl">
              Transparent digital queue estimation driven by party size compatibility, active dining table turnover, and automatic waitlist reassignment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!myQueueEntry ? (
              <button
                onClick={() => setShowJoinModal(true)}
                className="flex items-center gap-2 rounded-lg bg-[#1B4332] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E] transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Join Live Waitlist</span>
              </button>
            ) : (
              <button
                onClick={() => handleLeave(myQueueEntry.id)}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                Leave Waitlist ({myQueueEntry.id})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Special Banner if Staff offered a released cancelled table to this user! */}
      {myQueueEntry && (myQueueEntry.status === 'Table Available' || activeOffersForMe.length > 0) && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 shadow-md animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Waitlist Reassignment: Table Released!
              </span>
              <h2 className="font-display text-lg font-bold text-stone-900">
                A table matching your party size ({myQueueEntry.partySize} guests) is ready now!
              </h2>
              <p className="text-xs text-stone-600">
                A reservation cancellation released{' '}
                <strong>Table {myQueueEntry.assignedTableId || 'Allocated'}</strong>. Please confirm your acceptance within{' '}
                <span className="font-bold tabular-nums text-emerald-900">10 minutes</span>.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => acceptSlotOffer(myQueueEntry.id)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Accept Table</span>
              </button>
              <button
                onClick={() => declineSlotOffer(myQueueEntry.id)}
                className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Pass to Next</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active User's Queue Card (If joined) */}
      {myQueueEntry && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332]">
                Your Live Queue Position
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-display text-3xl font-extrabold text-stone-900 tabular-nums">
                  Token #{myQueueEntry.id}
                </span>
                <StatusBadge status={myQueueEntry.status} />
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-stone-600">
              <div>
                <span className="text-stone-400 block text-[11px]">Party Size</span>
                <span className="font-bold text-stone-900">{myQueueEntry.partySize} Guests</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Joined At</span>
                <span className="font-bold text-stone-900">{myQueueEntry.joinedAt}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Approx. Wait</span>
                <span className="font-display text-base font-extrabold text-[#C85A32] tabular-nums">
                  ~{myQueueEntry.estimatedWaitMinutes} mins
                </span>
              </div>
            </div>
          </div>

          {/* Stepper visualization */}
          <div className="pt-6">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#1B4332] text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="font-semibold text-stone-900">Queued</p>
                <p className="text-[10px] text-stone-400">Position recorded</p>
              </div>

              <div className="space-y-1">
                <div
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                    myQueueEntry.status !== 'Waiting'
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <p className="font-semibold text-stone-900">Table Ready</p>
                <p className="text-[10px] text-stone-400">Turnover notified</p>
              </div>

              <div className="space-y-1">
                <div
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                    myQueueEntry.status === 'Seated'
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  <Users className="h-4 w-4" />
                </div>
                <p className="font-semibold text-stone-900">Assigned</p>
                <p className="text-[10px] text-stone-400">Host seats party</p>
              </div>

              <div className="space-y-1">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="font-semibold text-stone-900">Dining</p>
                <p className="text-[10px] text-stone-400">Enjoy meal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Transparent Algorithm & Waitlist Table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Algorithm Explanation & Estimation Simulator */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1B4332] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-bold text-stone-900">
                Transparent Estimation Engine
              </h2>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Unlike generic single-line queues, our algorithm calculates dynamic wait times by matching <strong>party sizes to compatible table capacities</strong> rather than simple arrival timestamps.
            </p>

            {/* Live Algorithm Variables */}
            <div className="space-y-2.5 rounded-xl bg-stone-50 p-4 border border-stone-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Total Groups in Queue</span>
                <span className="font-bold tabular-nums text-stone-900">{waitingEntries.length} parties</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Average Dining Turnover</span>
                <span className="font-bold tabular-nums text-stone-900">60 mins / table</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Available Tables Right Now</span>
                <span className="font-bold tabular-nums text-emerald-700">
                  {tables.filter((t) => t.status === 'Available').length} tables
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Occupied &amp; In-Service</span>
                <span className="font-bold tabular-nums text-amber-700">
                  {tables.filter((t) => t.status === 'Occupied').length} tables
                </span>
              </div>
            </div>

            {/* Interactive Party Size Calculator */}
            <div className="border-t border-stone-100 pt-4 space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Simulate Estimated Wait for Party Size:
              </label>
              <div className="flex items-center gap-2">
                {[2, 4, 6, 8].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPartySize(size)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold border transition-colors ${
                      partySize === size
                        ? 'border-[#1B4332] bg-[#1B4332] text-white shadow-2xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {size} Guests
                  </button>
                ))}
              </div>

              {/* Calculation Output Card */}
              <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Compatible Tables in Restaurant:</span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {tables.filter((t) => t.capacity >= partySize).length} tables
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Groups Ahead with Similar Size:</span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {estimation.groupsAhead} groups
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-200/80 pt-2">
                  <span className="font-bold text-stone-800">Estimated Waiting Time:</span>
                  <span className="font-display text-base font-extrabold text-[#C85A32] tabular-nums">
                    ~{estimation.waitMinutes} minutes
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic">
              Notice: Wait times are approximate simulations based on average dining times and actual staff checkouts.
            </p>
          </div>
        </div>

        {/* Right Column: Live Queue Board */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Live Walk-in Waiting List ({waitingEntries.length} Active)
            </h3>
            <span className="text-[11px] text-stone-400">Refreshed live</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            {waitingEntries.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {waitingEntries.map((entry, idx) => {
                  const isMe = myQueueEntry?.id === entry.id;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 text-xs transition-colors ${
                        isMe ? 'bg-[#1B4332]/5 font-medium' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 font-display font-bold text-stone-700 tabular-nums">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{entry.customerName}</span>
                            {isMe && (
                              <span className="rounded bg-[#1B4332] px-1.5 py-0.2 text-[10px] text-white font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500">
                            Token {entry.id} &middot; Party of {entry.partySize} &middot; {entry.seatingPreference || 'Any Section'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="font-display font-bold text-stone-900 tabular-nums">
                            ~{entry.estimatedWaitMinutes}m
                          </span>
                          <span className="block text-[10px] text-stone-400">Joined {entry.joinedAt}</span>
                        </div>
                        <StatusBadge status={entry.status} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-stone-500">
                No guests currently in the live waitlist. Tables are open for immediate walk-ins!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Queue Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in duration-150">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Join the Live Walk-in Queue
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Get an instant token and estimated wait time based on your party size.
            </p>

            <form onSubmit={handleJoin} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700">Party Size (Guests)</label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700">Seating Area Preference</label>
                <select
                  value={seatingPreference}
                  onChange={(e) => setSeatingPreference(e.target.value as SeatingSection)}
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden bg-white"
                >
                  {SEATING_SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1B4332] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
                >
                  Confirm &amp; Get Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
