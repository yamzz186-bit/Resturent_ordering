import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  Calendar,
  UtensilsCrossed,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CANCELLATION_REASONS = [
  'Change of personal plans / travel delay',
  'Guest party size changed',
  'Selected alternative dining time',
  'Health / medical emergency',
  'Other reason',
];

export const CancellationPage: React.FC = () => {
  const {
    reservations,
    orders,
    cancelReservation,
    cancelOrder,
    queue,
    offerSlotToQueueCustomer,
    activeSlotOffers,
    currentUser,
    tables,
    addToast,
  } = useRestaurant();

  const [selectedResId, setSelectedResId] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [cancelAdvanceOrderToo, setCancelAdvanceOrderToo] = useState(true);
  const [confirmedCancellationId, setConfirmedCancellationId] = useState<string | null>(null);

  // Active reservations that can be cancelled
  const cancellableReservations = reservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Arrived'
  );

  const targetReservation = reservations.find((r) => r.id === selectedResId);
  const linkedOrder = targetReservation?.linkedOrderId
    ? orders.find((o) => o.id === targetReservation.linkedOrderId)
    : null;

  // Recent cancelled reservations
  const cancelledReservations = reservations.filter((r) => r.status === 'Cancelled');

  const handleConfirmCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId) return;

    const finalReason = selectedReason === 'Other reason' ? otherReasonText : selectedReason;

    // 1. Cancel Reservation
    const success = cancelReservation(selectedResId, finalReason);

    // 2. Cancel linked advance food order if selected
    if (linkedOrder && cancelAdvanceOrderToo) {
      cancelOrder(linkedOrder.id, `Linked reservation ${selectedResId} cancelled: ${finalReason}`);
    }

    if (success) {
      setConfirmedCancellationId(selectedResId);
      setSelectedResId('');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
          Operational Governance &amp; Turnaround
        </span>
        <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl mt-1">
          Cancellation &amp; Waitlist Management
        </h1>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl">
          Coordinate reservation cancellations, kitchen prep status decoupling, and automated slot reallocation for waiting walk-in parties.
        </p>
      </div>

      {/* Confirmation feedback card if just cancelled */}
      {confirmedCancellationId && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-stone-900">
                Reservation #{confirmedCancellationId} Successfully Cancelled
              </h2>
              <p className="text-xs text-stone-600">
                The allocated table slot has been released back into the restaurant inventory and offered to eligible waiting queue parties.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfirmedCancellationId(null)}
            className="text-xs font-semibold text-stone-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3 Pillars Architecture Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#1B4332]" />
            <span className="text-xs font-bold text-stone-800">1. Table Reservation</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Cancelling releases the physical table immediately to avoid vacant capacity.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-[#C85A32]" />
            <span className="text-xs font-bold text-stone-800">2. Advance Food Order</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Separately audited. If chefs have already started cooking (&ldquo;Preparing&rdquo;), the kitchen is notified immediately.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-800">3. Waitlist Reassignment</span>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Waiting parties matching the released party size receive an instant 10-minute priority offer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Customer Cancellation Action */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Cancel a Table Booking
              </h2>
              <span className="text-[11px] text-stone-400">Policy: 60 mins cutoff</span>
            </div>

            {cancellableReservations.length > 0 ? (
              <form onSubmit={handleConfirmCancellation} className="space-y-4 text-xs">
                {/* Select Booking */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Select Confirmed Reservation
                  </label>
                  <select
                    required
                    value={selectedResId}
                    onChange={(e) => setSelectedResId(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  >
                    <option value="">-- Choose active reservation --</option>
                    {cancellableReservations.map((r) => (
                      <option key={r.id} value={r.id}>
                        #{r.id} &middot; {r.customerName} ({r.partySize} Guests, {r.date} at {r.timeSlot})
                      </option>
                    ))}
                  </select>
                </div>

                {/* If selected, show details */}
                {targetReservation && (
                  <div className="rounded-xl bg-stone-50 p-4 border border-stone-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-stone-800">Booking Summary</span>
                      <StatusBadge status={targetReservation.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-stone-600 space-y-1">
                      <p>Guest: {targetReservation.customerName} &middot; {targetReservation.customerPhone}</p>
                      <p>Slot: {targetReservation.date} at {targetReservation.timeSlot} ({targetReservation.partySize} guests)</p>
                      <p>Allocated: Table {targetReservation.assignedTableId || 'Unassigned'} ({targetReservation.seatingPreference})</p>
                    </div>

                    {/* Linked order status */}
                    {linkedOrder && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 space-y-1">
                        <div className="flex justify-between items-center font-bold">
                          <span>Associated Kitchen Order #{linkedOrder.id}</span>
                          <StatusBadge status={linkedOrder.status} size="sm" />
                        </div>
                        <p>Total: ₹{linkedOrder.totalAmount} &middot; {linkedOrder.items.length} dishes</p>
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="cancelOrderChk"
                            checked={cancelAdvanceOrderToo}
                            onChange={(e) => setCancelAdvanceOrderToo(e.target.checked)}
                            className="rounded border-stone-300 accent-[#1B4332]"
                          />
                          <label htmlFor="cancelOrderChk" className="font-medium cursor-pointer">
                            Cancel associated food ticket as well
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancellation Reason */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Reason for Cancellation
                  </label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  >
                    {CANCELLATION_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>

                  {selectedReason === 'Other reason' && (
                    <textarea
                      required
                      value={otherReasonText}
                      onChange={(e) => setOtherReasonText(e.target.value)}
                      placeholder="Please briefly explain..."
                      rows={2}
                      className="mt-2 w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                    />
                  )}
                </div>

                {/* Policy Acknowledgement */}
                <div className="rounded-lg bg-stone-100 p-3 text-[11px] text-stone-600 leading-relaxed">
                  <p>
                    <strong>Simulated Policy Terms:</strong> By clicking below, your table reservation will be cancelled immediately, and table status updated. No monetary penalties are charged in this demo.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!selectedResId}
                  className={`w-full rounded-lg py-2.5 text-xs font-bold text-white shadow-xs transition-colors ${
                    selectedResId
                      ? 'bg-rose-700 hover:bg-rose-800'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Reservation Cancellation
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center text-xs text-stone-500">
                No active confirmed reservations available to cancel.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Waitlist Reassignment & Recent Released Slots */}
        <div className="space-y-6 lg:col-span-5">
          {/* Active Released Slot Offers */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Waitlist Reassignment Monitor ({activeSlotOffers.length} Active Offers)
            </h3>

            {activeSlotOffers.length > 0 ? (
              <div className="space-y-3">
                {activeSlotOffers.map((offer) => {
                  const targetQueue = queue.find((q) => q.id === offer.queueId);

                  return (
                    <div
                      key={offer.queueId}
                      className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3.5 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-900">
                          Offered Table {offer.tableId}
                        </span>
                        <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded font-bold text-emerald-900">
                          Expires: {offer.expiresAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Offered to <strong>{targetQueue?.customerName || offer.queueId}</strong> (Party of {targetQueue?.partySize || 2}). Released from cancelled #{offer.reservationId}.
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-stone-50 p-4 text-center text-xs text-stone-500 border border-stone-100">
                No active offers pending. Released tables are automatically assigned or matched to queue parties.
              </div>
            )}
          </div>

          {/* Cancellation Log */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Recently Cancelled Reservations
            </h3>

            <div className="divide-y divide-stone-100 text-xs">
              {cancelledReservations.slice(0, 5).map((r) => (
                <div key={r.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">#{r.id} ({r.customerName})</span>
                    <span className="text-[10px] text-stone-400">{r.cancelledAt || r.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Slot: {r.timeSlot} &middot; {r.partySize} Guests
                  </p>
                  {r.cancellationReason && (
                    <p className="text-[10px] text-rose-700 italic">
                      &ldquo;{r.cancellationReason}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
