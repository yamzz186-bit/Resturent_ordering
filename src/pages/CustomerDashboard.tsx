import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  CalendarDays,
  UtensilsCrossed,
  Users,
  Clock,
  ArrowRight,
  User,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, reservations, orders, queue, cancelReservation } = useRestaurant();

  // Filter items associated with current user
  const userReservations = reservations.filter(
    (r) =>
      r.customerPhone === currentUser.phone ||
      r.customerEmail === currentUser.email ||
      r.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const upcomingReservations = userReservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Arrived' || r.status === 'Seated'
  );

  const pastOrCancelledReservations = userReservations.filter(
    (r) => r.status === 'Completed' || r.status === 'Cancelled'
  );

  const userOrders = orders.filter(
    (o) =>
      o.customerPhone === currentUser.phone ||
      o.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const activeOrders = userOrders.filter(
    (o) => o.status !== 'Served' && o.status !== 'Collected' && o.status !== 'Cancelled'
  );

  const completedOrders = userOrders.filter(
    (o) => o.status === 'Served' || o.status === 'Collected' || o.status === 'Cancelled'
  );

  const myQueue = queue.find(
    (q) =>
      q.customerPhone === currentUser.phone ||
      q.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header & Quick Actions */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B4332] text-white font-bold text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-stone-900">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-xs text-stone-500">
                {currentUser.email} &middot; {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/reservations"
              className="flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#25553E] transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Book Table</span>
            </Link>

            <Link
              to="/menu"
              className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <UtensilsCrossed className="h-3.5 w-3.5 text-[#C85A32]" />
              <span>Order Food</span>
            </Link>

            <Link
              to="/queue"
              className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Live Queue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Queue Banner if in Queue */}
      {myQueue && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C85A32] text-white">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-stone-900">
                Active Live Waitlist Token #{myQueue.id}
              </p>
              <p className="text-stone-600">
                Party of {myQueue.partySize} &middot; Approx. wait ~{myQueue.estimatedWaitMinutes} mins &middot; Joined {myQueue.joinedAt}
              </p>
            </div>
          </div>
          <Link
            to="/queue"
            className="flex items-center gap-1 font-semibold text-[#1B4332] hover:underline"
          >
            <span>View Live Waitlist</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Active Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Active Kitchen Orders ({activeOrders.length})
          </h2>
          <Link to="/orders/track" className="text-xs font-medium text-[#1B4332] hover:underline">
            Open Order Tracker &rarr;
          </Link>
        </div>

        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-xs">#{order.id}</span>
                    <span className="text-[11px] text-stone-400">&middot; {order.orderType}</span>
                    {order.tableNumber && (
                      <span className="text-[11px] font-medium text-[#1B4332]">
                        (Table {order.tableNumber})
                      </span>
                    )}
                  </div>
                  <StatusBadge status={order.status} size="sm" />
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="truncate pr-2">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="tabular-nums font-medium">₹{item.itemTotal}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-[11px] text-stone-400 italic">
                      + {order.items.length - 3} additional dishes
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <span className="font-bold text-stone-900 tabular-nums">
                    Total: ₹{order.totalAmount}
                  </span>
                  <Link
                    to={`/orders/track?orderId=${order.id}`}
                    className="flex items-center gap-1 font-semibold text-[#1B4332] hover:underline"
                  >
                    <span>Track Live Prep</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-200 bg-white p-6 text-center text-xs text-stone-500">
            No active food orders in the kitchen. Pre-order from our menu to have dishes prepared for your arrival.
          </div>
        )}
      </div>

      {/* Upcoming Table Reservations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Upcoming Table Reservations ({upcomingReservations.length})
          </h2>
          <Link to="/reservations" className="text-xs font-medium text-[#1B4332] hover:underline">
            Book New Table &rarr;
          </Link>
        </div>

        {upcomingReservations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcomingReservations.map((res) => (
              <div
                key={res.id}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">#{res.id}</span>
                  <StatusBadge status={res.status} size="sm" />
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-lg bg-stone-50 p-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Date</span>
                    <span className="font-semibold text-stone-900">{res.date}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Slot</span>
                    <span className="font-semibold text-stone-900">{res.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Guests</span>
                    <span className="font-semibold text-stone-900">{res.partySize} Guests</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>
                    Table: <strong>{res.assignedTableId ? `Table ${res.assignedTableId}` : 'Assigned on arrival'}</strong> ({res.seatingPreference})
                  </span>
                  {res.hasAdvanceOrder && (
                    <span className="text-emerald-700 font-medium">Meal Pre-ordered</span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <Link
                    to="/cancellation"
                    className="text-stone-500 hover:text-rose-600 transition-colors"
                  >
                    Manage / Cancel
                  </Link>

                  {!res.hasAdvanceOrder && (
                    <Link
                      to="/menu"
                      className="font-semibold text-[#1B4332] hover:underline flex items-center gap-1"
                    >
                      Pre-order Food &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-200 bg-white p-6 text-center text-xs text-stone-500">
            No upcoming table reservations scheduled.
          </div>
        )}
      </div>

      {/* Booking History & Cancelled Log */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Booking &amp; Order History
        </h2>

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
          {pastOrCancelledReservations.length > 0 || completedOrders.length > 0 ? (
            <div className="divide-y divide-stone-100 text-xs">
              {pastOrCancelledReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800">Booking {r.id}</span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {r.date} at {r.timeSlot} &middot; {r.partySize} Guests &middot; {r.seatingPreference}
                    </p>
                    {r.cancellationReason && (
                      <p className="text-[11px] text-rose-700 mt-0.5 italic">
                        Reason: {r.cancellationReason}
                      </p>
                    )}
                  </div>
                  <span className="text-stone-400 text-[11px]">{r.createdAt}</span>
                </div>
              ))}
              {completedOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800">Order {o.id}</span>
                      <StatusBadge status={o.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {o.items.length} items &middot; ₹{o.totalAmount} &middot; {o.orderType}
                    </p>
                  </div>
                  <span className="text-stone-400 text-[11px]">{o.createdAt}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-stone-500">
              No previous dining history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
