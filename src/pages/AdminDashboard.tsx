import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem, DishCategory, SpiceLevel } from '../types';
import { DishImage } from '../components/common/DishImage';
import {
  UtensilsCrossed,
  Settings,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Clock,
  Calendar,
  Save,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES: DishCategory[] = [
  'Starters',
  'Main Course',
  'Biryani',
  'Pizza',
  'Burgers',
  'Desserts',
  'Beverages',
];

export const AdminDashboard: React.FC = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    toggleItemAvailability,
    deleteMenuItem,
    settings,
    updateSettings,
    reservations,
    orders,
    queue,
    resetToSampleData,
  } = useRestaurant();

  const [activeAdminTab, setActiveAdminTab] = useState<'menu' | 'settings' | 'reports'>('menu');

  // Menu Form Modal / Edit State
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form Fields for Add/Edit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DishCategory>('Main Course');
  const [price, setPrice] = useState(350);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [image, setImage] = useState('');
  const [hasPortionSizes, setHasPortionSizes] = useState(false);

  // Settings form
  const [openingTime, setOpeningTime] = useState(settings.openingTime);
  const [closingTime, setClosingTime] = useState(settings.closingTime);
  const [slotDuration, setSlotDuration] = useState(settings.slotDurationMinutes);
  const [avgDiningDuration, setAvgDiningDuration] = useState(settings.averageDiningDurationMinutes);
  const [avgPrepTime, setAvgPrepTime] = useState(settings.averagePrepTimeMinutes);
  const [cancellationCutoff, setCancellationCutoff] = useState(settings.cancellationCutoffMinutes);

  const openEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setName(dish.name);
    setDescription(dish.description);
    setCategory(dish.category);
    setPrice(dish.price);
    setPrepTimeMinutes(dish.prepTimeMinutes);
    setIsVegetarian(dish.isVegetarian);
    setImage(dish.image);
    setHasPortionSizes(!!dish.hasPortionSizes);
    setIsAddingNew(false);
  };

  const openAddModal = () => {
    setEditingDish(null);
    setName('');
    setDescription('');
    setCategory('Main Course');
    setPrice(350);
    setPrepTimeMinutes(20);
    setIsVegetarian(true);
    setImage('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80');
    setHasPortionSizes(false);
    setIsAddingNew(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    if (isAddingNew) {
      addMenuItem({
        name,
        description,
        category,
        price,
        rating: 4.8,
        reviewCount: 1,
        prepTimeMinutes,
        isVegetarian,
        isAvailable: true,
        image,
        hasPortionSizes,
        spiceLevelOptions: ['Mild', 'Medium', 'Spicy'],
        defaultSpiceLevel: 'Medium',
      });
    } else if (editingDish) {
      updateMenuItem(editingDish.id, {
        name,
        description,
        category,
        price,
        prepTimeMinutes,
        isVegetarian,
        image,
        hasPortionSizes,
      });
    }

    setEditingDish(null);
    setIsAddingNew(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      openingTime,
      closingTime,
      slotDurationMinutes: Number(slotDuration),
      averageDiningDurationMinutes: Number(avgDiningDuration),
      averagePrepTimeMinutes: Number(avgPrepTime),
      cancellationCutoffMinutes: Number(cancellationCutoff),
    });
  };

  // Report calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Served' || o.status === 'Collected').length;
  const totalReservations = reservations.length;
  const cancelledReservations = reservations.filter((r) => r.status === 'Cancelled').length;
  const completedReservations = reservations.filter((r) => r.status === 'Completed').length;
  const avgWaitInQueue = queue.length > 0 ? Math.round(queue.reduce((s, q) => s + q.estimatedWaitMinutes, 0) / queue.length) : 15;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            General Management &amp; Configuration
          </span>
          <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl mt-0.5">
            Admin Console &amp; Analytics
          </h1>
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-2xs">
          <button
            onClick={() => setActiveAdminTab('menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'menu'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Menu Management ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'reports'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Daily Reports &amp; KPIs</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeAdminTab === 'settings'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Operational Policies</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MENU MANAGEMENT */}
      {activeAdminTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-stone-900">
                Culinary Catalog Items
              </h2>
              <p className="text-xs text-stone-500">
                Toggle dish availability (Sold Out), modify prices, and edit portion configurations.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            <div className="divide-y divide-stone-100 text-xs">
              {menuItems.map((dish) => (
                <div key={dish.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <DishImage
                        src={dish.image}
                        alt={dish.name}
                        category={dish.category}
                        aspectRatioClass="h-full w-full"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 truncate">{dish.name}</span>
                        <span className="text-[10px] text-stone-400">({dish.category})</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            dish.isVegetarian
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {dish.isVegetarian ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate max-w-md">
                        {dish.description}
                      </p>
                      <div className="text-[11px] text-stone-600 mt-0.5 space-x-2">
                        <span className="font-semibold tabular-nums">₹{dish.price}</span>
                        <span>&middot;</span>
                        <span>~{dish.prepTimeMinutes}m prep</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleItemAvailability(dish.id)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        dish.isAvailable
                          ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>

                    <button
                      onClick={() => openEditModal(dish)}
                      className="rounded-lg border border-stone-200 bg-white p-1.5 text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                      aria-label="Edit dish"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${dish.name} from menu?`)) {
                          deleteMenuItem(dish.id);
                        }
                      }}
                      className="rounded-lg border border-stone-200 bg-white p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      aria-label="Delete dish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS & ANALYTICS */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Simulated Revenue
              </span>
              <p className="font-display text-2xl font-bold text-[#1B4332] tabular-nums">
                ₹{totalRevenue.toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Total active orders</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Food Orders
              </span>
              <p className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                {totalOrdersCount}
              </p>
              <span className="text-[10px] text-stone-400">{completedOrdersCount} fulfilled</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Reservations
              </span>
              <p className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                {totalReservations}
              </p>
              <span className="text-[10px] text-stone-400">{completedReservations} seated/completed</span>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Cancellations
              </span>
              <p className="font-display text-2xl font-bold text-rose-700 tabular-nums">
                {cancelledReservations}
              </p>
              <span className="text-[10px] text-stone-400">Slots freed &amp; reassigned</span>
            </div>
          </div>

          {/* Visual Operational Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Order Status Distribution
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Order Placed (Pending)', count: orders.filter((o) => o.status === 'Order Placed').length, color: 'bg-stone-400' },
                  { label: 'Accepted by Kitchen', count: orders.filter((o) => o.status === 'Accepted').length, color: 'bg-amber-400' },
                  { label: 'Preparing / Cooking', count: orders.filter((o) => o.status === 'Preparing').length, color: 'bg-amber-600' },
                  { label: 'Ready for Service', count: orders.filter((o) => o.status === 'Ready').length, color: 'bg-emerald-500' },
                  { label: 'Served / Collected', count: orders.filter((o) => o.status === 'Served' || o.status === 'Collected').length, color: 'bg-[#1B4332]' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-stone-600">
                      <span>{item.label}</span>
                      <span className="font-bold tabular-nums text-stone-900">{item.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${Math.min(100, (item.count / Math.max(1, orders.length)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Waitlist Turnover &amp; Reservation Health
              </h3>
              <div className="rounded-xl bg-stone-50 p-4 border border-stone-100 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Average Estimated Queue Wait</span>
                  <span className="font-bold tabular-nums text-stone-900">~{avgWaitInQueue} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Cancellation Reassignment Rate</span>
                  <span className="font-bold tabular-nums text-emerald-700">100% offered</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Table Slot Duration</span>
                  <span className="font-bold tabular-nums text-stone-900">{settings.slotDurationMinutes} mins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Average Dining Stay</span>
                  <span className="font-bold tabular-nums text-stone-900">{settings.averageDiningDurationMinutes} mins</span>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 text-[11px] text-emerald-800 border border-emerald-200">
                Table coordination metrics indicate balanced kitchen flow with no back-of-house logjams.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & POLICIES */}
      {activeAdminTab === 'settings' && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs max-w-2xl space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="font-display text-base font-bold text-stone-900">
              Operational Thresholds &amp; Settings
            </h2>
            <p className="text-xs text-stone-500">
              Tune parameters that govern the waitlist estimation algorithm and reservation slots.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Opening Time</label>
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Closing Time</label>
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Reservation Slot Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={30}
                  max={180}
                  step={15}
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Average Dining Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={30}
                  max={120}
                  step={5}
                  value={avgDiningDuration}
                  onChange={(e) => setAvgDiningDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Default Kitchen Prep Target (Minutes)
                </label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={avgPrepTime}
                  onChange={(e) => setAvgPrepTime(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Free Cancellation Cutoff (Minutes Before Slot)
                </label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  value={cancellationCutoff}
                  onChange={(e) => setCancellationCutoff(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <button
                type="button"
                onClick={resetToSampleData}
                className="flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Demo Data</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#1B4332] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E]"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Operational Policies</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit / Add Dish Modal */}
      {(editingDish || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-display text-base font-bold text-stone-900">
                {isAddingNew ? 'Add New Menu Item' : `Edit: ${editingDish?.name}`}
              </h2>
              <button
                onClick={() => {
                  setEditingDish(null);
                  setIsAddingNew(false);
                }}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dish Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DishCategory)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 bg-white focus:border-[#1B4332] focus:outline-hidden"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    min={20}
                    step={5}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estimated Prep Time (mins)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    required
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Diet Type</label>
                  <div className="flex gap-2 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={isVegetarian}
                        onChange={() => setIsVegetarian(true)}
                        className="accent-emerald-700"
                      />
                      <span>Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isVegetarian}
                        onChange={() => setIsVegetarian(false)}
                        className="accent-rose-700"
                      />
                      <span>Non-Veg</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 p-2 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="portionSizesCheck"
                  checked={hasPortionSizes}
                  onChange={(e) => setHasPortionSizes(e.target.checked)}
                  className="accent-[#1B4332] rounded"
                />
                <label htmlFor="portionSizesCheck" className="font-semibold text-stone-700 cursor-pointer">
                  Support Portion Sizing (Half / Full)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDish(null);
                    setIsAddingNew(false);
                  }}
                  className="rounded-lg border border-stone-200 px-3 py-1.5 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1B4332] px-4 py-1.5 font-semibold text-white shadow-xs hover:bg-[#25553E]"
                >
                  Save Dish Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
