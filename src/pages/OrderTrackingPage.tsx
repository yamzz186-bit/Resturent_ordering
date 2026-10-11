import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  Calendar,
  ChefHat,
  BellRing,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const STATUS_STEPS: OrderStatus[] = [
  'Order Placed',
  'Accepted',
  'Preparing',
  'Ready',
  'Served',
];

export const OrderTrackingPage: React.FC = () => {
  const { orders, currentUser } = useRestaurant();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryOrderId = searchParams.get('orderId');

  // Find active orders for user or all active orders
  const activeUserOrders = orders.filter(
    (o) =>
      o.customerPhone === currentUser.phone ||
      o.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) ||
      o.id === queryOrderId
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    queryOrderId || (activeUserOrders[0]?.id || orders[0]?.id || '')
  );

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || activeUserOrders[0] || orders[0];

  const handleOrderSelect = (id: string) => {
    setSelectedOrderId(id);
    setSearchParams({ orderId: id });
  };

  if (!currentOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-12 shadow-sm">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-stone-400" />
          <h2 className="mt-4 font-display text-xl font-bold text-stone-900">
            No Orders to Track
          </h2>
          <p className="mt-2 text-xs text-stone-500">
            You don't have any placed kitchen orders yet. Explore our menu to pre-order dishes for your table.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-lg bg-[#1B4332] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  // Calculate current step index
  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Collected') return 4;
    return STATUS_STEPS.indexOf(status);
  };

  const currentStepIdx = getStepIndex(currentOrder.status);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Live Kitchen Ticket Coordination
            </span>
            <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl mt-1">
              Live Food Order Tracking
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Real-time culinary preparation tracking synchronized between kitchen chefs and dining tables.
            </p>
          </div>

          {/* Order picker if multiple orders exist */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-500 whitespace-nowrap">Switch Order:</label>
              <select
                value={currentOrder.id}
                onChange={(e) => handleOrderSelect(e.target.value)}
                className="rounded-lg border border-stone-300 bg-white p-2 text-xs font-semibold text-stone-800 focus:border-[#1B4332] focus:outline-hidden"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} ({o.customerName}) &ndash; {o.status}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Order Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-8">
        {/* Order Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold text-stone-900 tabular-nums">
                Ticket #{currentOrder.id}
              </span>
              <StatusBadge status={currentOrder.status} />
            </div>
            <p className="text-xs text-stone-500">
              Customer: <strong>{currentOrder.customerName}</strong> ({currentOrder.customerPhone})
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-600">
            <div>
              <span className="text-stone-400 block text-[11px]">Format</span>
              <span className="font-bold text-stone-900">{currentOrder.orderType}</span>
            </div>
            {currentOrder.tableNumber && (
              <div>
                <span className="text-stone-400 block text-[11px]">Table Location</span>
                <span className="font-bold text-[#1B4332]">Table {currentOrder.tableNumber}</span>
              </div>
            )}
            <div>
              <span className="text-stone-400 block text-[11px]">Target Serving</span>
              <span className="font-bold text-stone-900">{currentOrder.expectedServingTime}</span>
            </div>
          </div>
        </div>

        {/* Visual Stepper / Status Flow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Kitchen Preparation Timeline
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Est. Prep: ~{currentOrder.estimatedPrepMinutes} mins
            </span>
          </div>

          <div className="relative pt-2">
            {/* Progress bar background */}
            <div className="absolute top-5 left-4 right-4 h-1 bg-stone-200 -z-0" />
            <div
              className="absolute top-5 left-4 h-1 bg-[#1B4332] transition-all duration-500 -z-0"
              style={{
                width: `${Math.min(100, Math.max(0, (currentStepIdx / (STATUS_STEPS.length - 1)) * 100))}%`,
              }}
            />

            {/* Stepper nodes */}
            <div className="relative z-10 grid grid-cols-5 gap-2 text-center text-xs">
              {STATUS_STEPS.map((stepName, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                const getTimestamp = () => {
                  if (stepName === 'Order Placed') return currentOrder.statusTimestamps.placedAt;
                  if (stepName === 'Accepted') return currentOrder.statusTimestamps.acceptedAt;
                  if (stepName === 'Preparing') return currentOrder.statusTimestamps.preparingAt;
                  if (stepName === 'Ready') return currentOrder.statusTimestamps.readyAt;
                  if (stepName === 'Served') return currentOrder.statusTimestamps.completedAt;
                  return null;
                };

                const timestamp = getTimestamp();

                return (
                  <div key={stepName} className="flex flex-col items-center space-y-1">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'border-[#1B4332] bg-[#1B4332] text-white ring-4 ring-[#1B4332]/20 font-bold'
                          : isPassed
                          ? 'border-[#1B4332] bg-[#1B4332] text-white'
                          : 'border-stone-300 bg-white text-stone-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <span className="tabular-nums">{idx + 1}</span>}
                    </div>

                    <p className={`font-semibold text-[11px] ${isCurrent ? 'text-[#1B4332]' : isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                      {currentOrder.orderType === 'Takeaway' && stepName === 'Served' ? 'Collected' : stepName}
                    </p>

                    {timestamp && (
                      <span className="text-[10px] text-stone-400 tabular-nums">
                        {timestamp}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live sync note */}
        <div className="rounded-xl bg-stone-50 p-4 border border-stone-200/70 flex items-start gap-3 text-xs text-stone-600">
          <ChefHat className="h-5 w-5 text-[#1B4332] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-stone-800">
              Coordinated Kitchen Execution
            </p>
            <p className="leading-relaxed">
              When kitchen staff or head chefs update ticket progress on the restaurant operational dashboard, your tracking view updates immediately.
            </p>
          </div>
        </div>

        {/* Itemized Order Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Dishes in This Ticket ({currentOrder.items.length})
          </h3>

          <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 overflow-hidden text-xs">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 bg-white">
                <div className="space-y-1">
                  <p className="font-bold text-stone-900">
                    {item.quantity}x {item.menuItem.name}
                  </p>
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    {item.customization.portionSize && (
                      <span>Portion: {item.customization.portionSize} &middot; </span>
                    )}
                    {item.customization.spiceLevel && (
                      <span>Spice: {item.customization.spiceLevel} &middot; </span>
                    )}
                    {item.customization.selectedAddons.length > 0 && (
                      <span>
                        Addons: {item.customization.selectedAddons.map((a) => a.name).join(', ')}
                      </span>
                    )}
                  </div>
                  {item.customization.specialInstructions && (
                    <p className="text-[11px] italic text-amber-800">
                      Note: &ldquo;{item.customization.specialInstructions}&rdquo;
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-bold text-stone-900 tabular-nums">
                    ₹{item.itemTotal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing details */}
        <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="text-stone-500">
            {currentOrder.discountCode && (
              <p>Promo code {currentOrder.discountCode} applied (-₹{currentOrder.discountAmount})</p>
            )}
            <p>Includes 5% GST and 5% Service Charge</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-stone-500">Total Paid/Billed:</span>
            <span className="font-display text-xl font-bold text-[#1B4332] tabular-nums">
              ₹{currentOrder.totalAmount}
            </span>
          </div>
        </div>

        {/* Links to staff simulation */}
        <div className="border-t border-stone-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            to="/dashboard"
            className="font-medium text-stone-600 hover:text-stone-900"
          >
            &larr; Back to My Dashboard
          </Link>

          <Link
            to="/staff"
            className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2 font-semibold text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <span>Switch to Staff Console to test kitchen status transitions &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
