import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  ReservationStatus,
  OrderStatus,
  TableStatus,
  Table,
  Reservation,
  Order,
  QueueEntry,
} from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  LayoutDashboard,
  CalendarDays,
  ChefHat,
  Grid,
  Users,
  Clock,
  Search,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Filter,
} from 'lucide-react';

type StaffTab = 'overview' | 'reservations' | 'kitchen' | 'tables' | 'waitlist';

export const StaffDashboard: React.FC = () => {
  const {
    reservations,
    updateReservationStatus,
    cancelReservation,
    orders,
    updateOrderStatus,
    tables,
    updateTableStatus,
    queue,
    updateQueueStatus,
    offerSlotToQueueCustomer,
    activeSlotOffers,
    settings,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<StaffTab>('overview');

  // Search & filter states for reservations
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState<string>('all');

  // Table filter
  const [tableSectionFilter, setTableSectionFilter] = useState<string>('all');

  // Operational metrics
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const availableCount = tables.filter((t) => t.status === 'Available').length;
  const cleaningCount = tables.filter((t) => t.status === 'Cleaning').length;
  const waitingGroupsCount = queue.filter((q) => q.status === 'Waiting').length;
  const activeKitchenOrdersCount = orders.filter(
    (o) => o.status !== 'Served' && o.status !== 'Collected' && o.status !== 'Cancelled'
  ).length;

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (resStatusFilter !== 'all' && r.status !== resStatusFilter) return false;
      if (resSearch.trim()) {
        const q = resSearch.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchName = r.customerName.toLowerCase().includes(q);
        const matchPhone = r.customerPhone.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [reservations, resSearch, resStatusFilter]);

  // Kitchen Kanban buckets
  const kitchenPlaced = orders.filter((o) => o.status === 'Order Placed');
  const kitchenAccepted = orders.filter((o) => o.status === 'Accepted');
  const kitchenPreparing = orders.filter((o) => o.status === 'Preparing');
  const kitchenReady = orders.filter((o) => o.status === 'Ready');
  const kitchenServed = orders.filter((o) => o.status === 'Served' || o.status === 'Collected');

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      if (tableSectionFilter !== 'all' && t.section !== tableSectionFilter) return false;
      return true;
    });
  }, [tables, tableSectionFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header & Operational Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Staff Operations Portal
          </span>
          <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl mt-0.5">
            Floor, Kitchen &amp; Reservation Coordination
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1 shadow-2xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'reservations'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Reservations ({reservations.filter((r) => r.status === 'Confirmed').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'kitchen'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ChefHat className="h-3.5 w-3.5" />
            <span>Kitchen Kanban ({activeKitchenOrdersCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'tables'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Floor Plan ({occupiedCount}/{tables.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'waitlist'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Live Queue ({waitingGroupsCount})</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metric cards strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Occupied
              </span>
              <p className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">
                {occupiedCount} <span className="text-xs font-normal text-stone-400">/ {tables.length}</span>
              </p>
              <span className="text-[10px] text-stone-400">Tables in service</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Available
              </span>
              <p className="font-display text-2xl font-bold text-emerald-700 tabular-nums">
                {availableCount}
              </p>
              <span className="text-[10px] text-stone-400">Ready for guests</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Waitlist Queue
              </span>
              <p className="font-display text-2xl font-bold text-[#C85A32] tabular-nums">
                {waitingGroupsCount}
              </p>
              <span className="text-[10px] text-stone-400">Parties waiting</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Active Kitchen
              </span>
              <p className="font-display text-2xl font-bold text-amber-700 tabular-nums">
                {activeKitchenOrdersCount}
              </p>
              <span className="text-[10px] text-stone-400">Cooking tickets</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Cleaning
              </span>
              <p className="font-display text-2xl font-bold text-stone-700 tabular-nums">
                {cleaningCount}
              </p>
              <span className="text-[10px] text-stone-400">Being sanitized</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Avg Prep Time
              </span>
              <p className="font-display text-2xl font-bold text-stone-800 tabular-nums">
                ~{settings.averagePrepTimeMinutes}m
              </p>
              <span className="text-[10px] text-stone-400">Target turnaround</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* Left: Active Reservations Quick Feed */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4 lg:col-span-7">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Today's Pending &amp; Active Bookings
                </h3>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className="text-xs font-semibold text-[#1B4332] hover:underline"
                >
                  Manage All &rarr;
                </button>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {reservations.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{r.customerName}</span>
                        <StatusBadge status={r.status} size="sm" />
                        {r.hasAdvanceOrder && (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                            Pre-ordered
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {r.timeSlot} &middot; {r.partySize} Guests &middot; Table {r.assignedTableId || 'Unassigned'} ({r.seatingPreference})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {r.status === 'Confirmed' && (
                        <button
                          onClick={() => updateReservationStatus(r.id, 'Seated')}
                          className="rounded bg-[#1B4332] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#25553E]"
                        >
                          Seat Guests
                        </button>
                      )}
                      {r.status === 'Seated' && (
                        <button
                          onClick={() => updateReservationStatus(r.id, 'Completed')}
                          className="rounded border border-stone-300 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floor status summary */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4 lg:col-span-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Floor Capacity Breakdown
                </h3>
                <button
                  onClick={() => setActiveTab('tables')}
                  className="text-xs font-semibold text-[#1B4332] hover:underline"
                >
                  Interactive Plan &rarr;
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {tables.slice(0, 9).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTab('tables')}
                    className={`cursor-pointer rounded-lg border p-2.5 text-center text-xs transition-colors ${
                      t.status === 'Available'
                        ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50'
                        : t.status === 'Occupied'
                        ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/50'
                        : t.status === 'Cleaning'
                        ? 'border-stone-200 bg-stone-100 hover:bg-stone-200'
                        : 'border-blue-200 bg-blue-50/50'
                    }`}
                  >
                    <span className="font-bold text-stone-900 block">{t.name}</span>
                    <span className="text-[10px] text-stone-500 block">{t.capacity} Seats</span>
                    <span className="mt-1 block text-[10px] font-semibold">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RESERVATIONS MANAGEMENT */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {/* Search & filter toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-2xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
                placeholder="Search guest name or ref..."
                className="w-full rounded-lg border border-stone-200 py-1.5 pl-9 pr-3 text-xs text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Status:</span>
              <select
                value={resStatusFilter}
                onChange={(e) => setResStatusFilter(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white p-1.5 text-xs text-stone-800 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Arrived">Arrived</option>
                <option value="Seated">Seated</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Reservations List */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            <div className="divide-y divide-stone-100 text-xs">
              {filteredReservations.map((res) => (
                <div key={res.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">#{res.id} &middot; {res.customerName}</span>
                      <StatusBadge status={res.status} size="sm" />
                      {res.hasAdvanceOrder && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          Pre-ordered Food (#{res.linkedOrderId})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Phone: {res.customerPhone} &middot; {res.date} at {res.timeSlot} &middot; {res.partySize} Guests
                    </p>
                    <p className="text-[11px] text-stone-600">
                      Table: <strong>{res.assignedTableId ? `Table ${res.assignedTableId}` : 'Unassigned'}</strong> &middot; Section: {res.seatingPreference}
                    </p>
                    {res.specialRequests && (
                      <p className="text-[11px] italic text-amber-800">
                        Notes: &ldquo;{res.specialRequests}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {res.status === 'Confirmed' && (
                      <>
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Arrived')}
                          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                        >
                          Mark Arrived
                        </button>
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Seated')}
                          className="rounded-lg bg-[#1B4332] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
                        >
                          Seat Guests
                        </button>
                      </>
                    )}

                    {res.status === 'Arrived' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'Seated')}
                        className="rounded-lg bg-[#1B4332] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
                      >
                        Seat at Table
                      </button>
                    )}

                    {res.status === 'Seated' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'Completed')}
                        className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                      >
                        Complete Dining
                      </button>
                    )}

                    {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                      <button
                        onClick={() => {
                          const r = prompt('Reason for cancelling this reservation:');
                          if (r) cancelReservation(res.id, r);
                        }}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: KITCHEN KANBAN DASHBOARD */}
      {activeTab === 'kitchen' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <p>
              Click status advance buttons to move dishes along the kitchen assembly pipeline. Updates sync immediately to the guest tracking page.
            </p>
            <span className="font-semibold text-stone-700">5 Pipeline Stages</span>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
            {/* Column 1: Placed */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
                  New Placed
                </span>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-bold text-stone-700 tabular-nums">
                  {kitchenPlaced.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {kitchenPlaced.map((ord) => (
                  <div key={ord.id} className="rounded-lg border border-stone-200 bg-white p-3 shadow-2xs space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-stone-900">#{ord.id}</span>
                      <span className="text-[10px] text-stone-400">{ord.createdAt.split(' ')[1] || ord.createdAt}</span>
                    </div>
                    <p className="font-medium text-stone-800">{ord.customerName}</p>
                    <div className="text-[11px] text-stone-500">
                      {ord.tableNumber ? `Table ${ord.tableNumber}` : ord.orderType} &middot; Target: {ord.expectedServingTime}
                    </div>
                    <div className="text-[11px] text-stone-600 border-t border-stone-100 pt-1.5 space-y-0.5">
                      {ord.items.map((i) => (
                        <p key={i.id} className="truncate">{i.quantity}x {i.menuItem.name}</p>
                      ))}
                    </div>
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                      className="w-full rounded bg-[#1B4332] py-1.5 text-xs font-semibold text-white hover:bg-[#25553E]"
                    >
                      Accept Ticket
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Accepted */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
                  Accepted
                </span>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-bold text-stone-700 tabular-nums">
                  {kitchenAccepted.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {kitchenAccepted.map((ord) => (
                  <div key={ord.id} className="rounded-lg border border-stone-200 bg-white p-3 shadow-2xs space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-stone-900">#{ord.id}</span>
                      <span className="text-[10px] text-stone-400">Target {ord.expectedServingTime}</span>
                    </div>
                    <p className="font-medium text-stone-800">{ord.customerName}</p>
                    <div className="text-[11px] text-stone-600 border-t border-stone-100 pt-1.5 space-y-0.5">
                      {ord.items.map((i) => (
                        <p key={i.id} className="truncate">{i.quantity}x {i.menuItem.name}</p>
                      ))}
                    </div>
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                      className="w-full rounded bg-[#C85A32] py-1.5 text-xs font-semibold text-white hover:bg-[#b54f2a]"
                    >
                      Start Cooking
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Preparing */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
                  Cooking / Preparing
                </span>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900 tabular-nums">
                  {kitchenPreparing.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {kitchenPreparing.map((ord) => (
                  <div key={ord.id} className="rounded-lg border border-amber-200 bg-white p-3 shadow-2xs space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-stone-900">#{ord.id}</span>
                      <span className="text-[10px] text-amber-700 font-semibold">Prep ~{ord.estimatedPrepMinutes}m</span>
                    </div>
                    <p className="font-medium text-stone-800">{ord.customerName} ({ord.tableNumber ? `Table ${ord.tableNumber}` : 'Takeaway'})</p>
                    <div className="text-[11px] text-stone-600 border-t border-stone-100 pt-1.5 space-y-0.5">
                      {ord.items.map((i) => (
                        <p key={i.id} className="truncate">{i.quantity}x {i.menuItem.name} {i.customization.spiceLevel ? `(${i.customization.spiceLevel})` : ''}</p>
                      ))}
                    </div>
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Ready')}
                      className="w-full rounded bg-emerald-700 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      Mark Ready for Server
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Ready */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                  Plated &amp; Ready
                </span>
                <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-900 tabular-nums">
                  {kitchenReady.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {kitchenReady.map((ord) => (
                  <div key={ord.id} className="rounded-lg border border-emerald-200 bg-white p-3 shadow-2xs space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-stone-900">#{ord.id}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">READY NOW</span>
                    </div>
                    <p className="font-medium text-stone-800">
                      Deliver to: <strong>{ord.tableNumber ? `Table ${ord.tableNumber}` : 'Takeaway Counter'}</strong>
                    </p>
                    <button
                      onClick={() => updateOrderStatus(ord.id, ord.orderType === 'Takeaway' ? 'Collected' : 'Served')}
                      className="w-full rounded bg-[#1B4332] py-1.5 text-xs font-semibold text-white hover:bg-[#25553E]"
                    >
                      Confirm Served
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 5: Served / Completed */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-stone-600">
                  Served Today
                </span>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-bold text-stone-700 tabular-nums">
                  {kitchenServed.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {kitchenServed.slice(0, 4).map((ord) => (
                  <div key={ord.id} className="rounded-lg border border-stone-200 bg-white p-2.5 text-xs space-y-1 opacity-75">
                    <div className="flex justify-between">
                      <span className="font-bold text-stone-800">#{ord.id}</span>
                      <span className="text-[10px] text-stone-400">{ord.statusTimestamps.completedAt || 'Completed'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">{ord.customerName} &middot; ₹{ord.totalAmount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: TABLE MANAGEMENT FLOOR PLAN */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-stone-700">Filter Section:</span>
              <select
                value={tableSectionFilter}
                onChange={(e) => setTableSectionFilter(e.target.value)}
                className="rounded-lg border border-stone-200 p-1.5 text-stone-900 bg-white"
              >
                <option value="all">All Sections ({tables.length})</option>
                <option value="Main Dining Hall">Main Dining Hall</option>
                <option value="Outdoor Terrace">Outdoor Terrace</option>
                <option value="Window View">Window View</option>
                <option value="Private Booth">Private Booth</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Reserved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-stone-400" /> Cleaning
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.map((table) => {
              const assignedRes = table.currentReservationId
                ? reservations.find((r) => r.id === table.currentReservationId)
                : null;

              return (
                <div
                  key={table.id}
                  className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-stone-900 text-sm">
                        {table.name}
                      </h4>
                      <span className="text-[11px] text-stone-500">
                        {table.capacity} Guests &middot; {table.section}
                      </span>
                    </div>
                    <StatusBadge status={table.status} size="sm" />
                  </div>

                  {assignedRes && (
                    <div className="rounded-lg bg-stone-50 p-2.5 text-[11px] text-stone-700 space-y-0.5">
                      <p className="font-semibold">Booking: {assignedRes.customerName}</p>
                      <p className="text-stone-500">Slot: {assignedRes.timeSlot} ({assignedRes.partySize} guests)</p>
                    </div>
                  )}

                  {/* Status switcher buttons */}
                  <div className="border-t border-stone-100 pt-2.5">
                    <span className="text-[10px] text-stone-400 block mb-1">Set Table Status:</span>
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      <button
                        onClick={() => updateTableStatus(table.id, 'Available')}
                        className={`rounded py-1 font-semibold transition-colors ${
                          table.status === 'Available'
                            ? 'bg-emerald-700 text-white'
                            : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Free
                      </button>
                      <button
                        onClick={() => updateTableStatus(table.id, 'Occupied')}
                        className={`rounded py-1 font-semibold transition-colors ${
                          table.status === 'Occupied'
                            ? 'bg-amber-700 text-white'
                            : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Seat
                      </button>
                      <button
                        onClick={() => updateTableStatus(table.id, 'Cleaning')}
                        className={`rounded py-1 font-semibold transition-colors ${
                          table.status === 'Cleaning'
                            ? 'bg-stone-700 text-white'
                            : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Clean
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: LIVE WAITLIST & REASSIGNMENT */}
      {activeTab === 'waitlist' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Active Walk-in Waitlist ({queue.length} entries)
            </h3>
            <p className="text-xs text-stone-500">
              Hostesses can seat waiting parties, update queue statuses, or manually allocate released cancellation slots.
            </p>

            <div className="divide-y divide-stone-100 text-xs">
              {queue.map((q) => (
                <div key={q.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">Token #{q.id} &middot; {q.customerName}</span>
                      <StatusBadge status={q.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Phone: {q.customerPhone} &middot; Party of {q.partySize} &middot; Joined {q.joinedAt} &middot; Est. Wait ~{q.estimatedWaitMinutes}m
                    </p>
                    {q.offerExpiresAt && (
                      <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                        Slot offered! Table {q.assignedTableId} (Expires at {q.offerExpiresAt})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {q.status === 'Waiting' && (
                      <>
                        <button
                          onClick={() => {
                            const avail = tables.find((t) => t.status === 'Available' && t.capacity >= q.partySize);
                            if (avail) {
                              updateQueueStatus(q.id, 'Seated', avail.id);
                            } else {
                              alert('No free table matching this party size currently available.');
                            }
                          }}
                          className="rounded-lg bg-[#1B4332] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
                        >
                          Seat Party
                        </button>

                        <button
                          onClick={() => {
                            // Find a table to offer
                            const t = tables.find((tbl) => tbl.capacity >= q.partySize);
                            if (t) {
                              offerSlotToQueueCustomer(q.id, 'CANC-SLOT', t.id, 'Current Slot');
                            }
                          }}
                          className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                        >
                          Offer Released Table
                        </button>
                      </>
                    )}

                    {q.status !== 'Cancelled' && q.status !== 'Seated' && (
                      <button
                        onClick={() => updateQueueStatus(q.id, 'Cancelled')}
                        className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Cancel Token
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
