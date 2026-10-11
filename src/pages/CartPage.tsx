import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { DishImage } from '../components/common/DishImage';
import { OrderType } from '../types';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    couponCode,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartGst,
    cartServiceCharge,
    cartDiscount,
    cartTotal,
    reservations,
    createOrder,
    currentUser,
    addToast,
  } = useRestaurant();

  const navigate = useNavigate();

  // Checkout inputs
  const [orderType, setOrderType] = useState<OrderType>('Dine-in');
  const [selectedReservationId, setSelectedReservationId] = useState<string>('');
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [expectedArrival, setExpectedArrival] = useState('13:30');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Eligible active reservations for current user or today
  const activeReservations = reservations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Seated'
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing an advance order.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name and phone number for kitchen verification.');
      return;
    }

    if (orderType === 'Dine-in' && !selectedReservationId) {
      setErrorMessage('For Dine-in pre-orders, please link an existing confirmed reservation or choose Takeaway.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const linkedRes = activeReservations.find((r) => r.id === selectedReservationId);

      const placedOrder = createOrder({
        customerName,
        customerPhone,
        orderType,
        linkedReservationId: selectedReservationId || undefined,
        tableNumber: linkedRes?.assignedTableId,
        specialInstructions: specialInstructions.trim() || undefined,
        expectedServingTime: expectedArrival,
      });

      setIsSubmitting(false);
      navigate(`/orders/track?orderId=${placedOrder.id}`);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-12 shadow-sm max-w-md mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-stone-900">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-xs text-stone-500 leading-relaxed">
            Browse our menu to customize your dishes, choose portion sizes and spice levels, and order ahead for your table.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to="/menu"
              className="rounded-lg bg-[#1B4332] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E] transition-colors"
            >
              Explore Dining Menu
            </Link>
            <Link
              to="/reservations"
              className="rounded-lg border border-stone-300 bg-white px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Reserve a Table First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">
          Shopping Bag &amp; Advance Order Coordination
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review customized dishes, apply demo coupons, and link your meal to your table reservation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Cart items list */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Selected Dishes ({cart.length})
            </h2>
            <button
              onClick={clearCart}
              className="text-xs font-medium text-rose-600 hover:underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <DishImage
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      category={item.menuItem.category}
                      aspectRatioClass="h-full w-full"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xs font-bold text-stone-900 truncate">
                      {item.menuItem.name}
                    </h3>

                    {/* Customization Details */}
                    <div className="text-[11px] text-stone-500 space-y-0.5">
                      {item.customization.portionSize && (
                        <p>Portion: <strong className="text-stone-700">{item.customization.portionSize}</strong></p>
                      )}
                      {item.customization.spiceLevel && (
                        <p>Spice Level: <strong className="text-stone-700">{item.customization.spiceLevel}</strong></p>
                      )}
                      {item.customization.selectedAddons.length > 0 && (
                        <p>
                          Extras: {item.customization.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.customization.specialInstructions && (
                        <p className="italic text-amber-800">
                          Note: &ldquo;{item.customization.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: Qty & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <div className="flex items-center rounded-lg border border-stone-300 bg-white">
                    <button
                      type="button"
                      onClick={() => updateCartItemQuantity(item.id, -1)}
                      className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartItemQuantity(item.id, 1)}
                      className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="font-display text-sm font-bold text-stone-900 tabular-nums">
                      ₹{item.itemTotal}
                    </span>
                    <span className="text-[10px] text-stone-400 block tabular-nums">
                      (₹{item.customization.unitPrice} ea)
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:underline"
            >
              <span>&larr; Add more items from menu</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Checkout & Billing */}
        <div className="space-y-6 lg:col-span-5">
          {/* Billing Breakdown */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Order Summary
            </h2>

            {/* Discount Code Input */}
            <div className="rounded-lg bg-stone-50 p-3 border border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-[#C85A32]" />
                  Promo Code
                </span>
                <span className="text-[11px] text-stone-400">Try WELCOME10 or FEAST50</span>
              </div>
              {couponCode ? (
                <div className="flex items-center justify-between rounded-md bg-emerald-50 px-3 py-1.5 border border-emerald-200 text-xs">
                  <span className="font-semibold text-emerald-800">
                    {couponCode} Applied ({couponCode === 'WELCOME10' ? '10%' : '15%'} off)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-rose-600 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-xs uppercase text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-stone-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-900"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Charges */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="tabular-nums font-medium text-stone-900">₹{cartSubtotal}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Savings</span>
                  <span className="tabular-nums font-medium">-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span className="tabular-nums font-medium text-stone-900">₹{cartGst}</span>
              </div>

              <div className="flex justify-between">
                <span>Hospitality Service Charge (5%)</span>
                <span className="tabular-nums font-medium text-stone-900">₹{cartServiceCharge}</span>
              </div>

              <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="font-display text-base font-extrabold text-[#1B4332] tabular-nums">
                  ₹{cartTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Coordination Form */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Kitchen Coordination Details
            </h2>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
              {/* Order Type Tabs */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dining Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Dine-in', 'Takeaway'] as OrderType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition-colors ${
                        orderType === type
                          ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {type === 'Dine-in' ? 'Dine-in at Table' : 'Takeaway Counter'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dine-in Table Linker */}
              {orderType === 'Dine-in' && (
                <div className="rounded-lg bg-amber-50/70 p-3 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#1B4332]" />
                      Link Table Reservation
                    </label>
                    <Link
                      to="/reservations"
                      className="text-[11px] font-semibold text-[#1B4332] hover:underline"
                    >
                      + Book new table
                    </Link>
                  </div>

                  {activeReservations.length > 0 ? (
                    <select
                      value={selectedReservationId}
                      onChange={(e) => setSelectedReservationId(e.target.value)}
                      className="w-full rounded-md border border-stone-300 bg-white p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                    >
                      <option value="">-- Choose your reservation --</option>
                      {activeReservations.map((res) => (
                        <option key={res.id} value={res.id}>
                          {res.id} &middot; {res.customerName} ({res.partySize} guests, {res.timeSlot}) [Table {res.assignedTableId || 'Auto'}]
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-[11px] text-stone-600">
                      No active confirmed bookings found.{' '}
                      <Link to="/reservations" className="text-[#1B4332] font-semibold underline">
                        Create a table booking
                      </Link>{' '}
                      first to associate your meal with an arrival time.
                    </div>
                  )}
                </div>
              )}

              {/* Customer Contact */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-stone-700">Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700">Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Expected Arrival */}
              <div>
                <label className="block font-semibold text-stone-700">
                  Target Serving / Arrival Time
                </label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="time"
                    value={expectedArrival}
                    onChange={(e) => setExpectedArrival(e.target.value)}
                    className="w-full rounded-md border border-stone-200 p-2 pl-9 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  Kitchen will initiate hot preparation 20 minutes prior to this time.
                </p>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block font-semibold text-stone-700">Overall Order Notes</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please serve starters and beverages immediately upon seating..."
                  rows={2}
                  className="mt-1 w-full rounded-md border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#1B4332] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E] transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Dispatching to Kitchen...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Dispatch Advance Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
