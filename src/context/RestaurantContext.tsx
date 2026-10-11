import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  Table,
  Reservation,
  QueueEntry,
  Order,
  CartItem,
  CartItemCustomization,
  AdminSettings,
  UserProfile,
  UserRole,
  OrderStatus,
  ReservationStatus,
  QueueStatus,
  TableStatus,
  SeatingSection,
  OrderType,
  ToastMessage,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_RESERVATIONS,
  INITIAL_QUEUE,
  INITIAL_ORDERS,
  INITIAL_ADMIN_SETTINGS,
} from '../data/seedData';

interface ReleasedSlotOffer {
  queueId: string;
  reservationId: string;
  tableId: string;
  timeSlot: string;
  expiresAt: string;
}

interface RestaurantContextType {
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];

  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  toggleItemAvailability: (id: string) => void;
  deleteMenuItem: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, customization: CartItemCustomization, quantity: number) => boolean;
  updateCartItemQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  couponCode: string;
  discountRate: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  cartSubtotal: number;
  cartGst: number;
  cartServiceCharge: number;
  cartDiscount: number;
  cartTotal: number;

  // Tables
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus, reservationId?: string, orderId?: string) => void;
  getAvailableTablesForParty: (partySize: number, date: string, timeSlot: string) => Table[];

  // Reservations
  reservations: Reservation[];
  createReservation: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    partySize: number;
    seatingPreference: SeatingSection;
    specialRequests?: string;
  }) => Reservation | null;
  cancelReservation: (reservationId: string, reason: string) => boolean;
  updateReservationStatus: (reservationId: string, status: ReservationStatus, tableId?: string) => void;

  // Live Queue
  queue: QueueEntry[];
  joinQueue: (customerName: string, customerPhone: string, partySize: number, seatingPreference?: SeatingSection) => QueueEntry;
  leaveQueue: (queueId: string) => void;
  updateQueueStatus: (queueId: string, status: QueueStatus, tableId?: string) => void;
  calculateQueueEstimation: (partySize: number) => { waitMinutes: number; groupsAhead: number; availableTablesMatch: number };
  activeSlotOffers: ReleasedSlotOffer[];
  offerSlotToQueueCustomer: (queueId: string, reservationId: string, tableId: string, timeSlot: string) => void;
  acceptSlotOffer: (queueId: string) => void;
  declineSlotOffer: (queueId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    orderType: OrderType;
    linkedReservationId?: string;
    tableNumber?: string;
    specialInstructions?: string;
    expectedServingTime?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string, reason: string) => void;

  // Settings
  settings: AdminSettings;
  updateSettings: (updates: Partial<AdminSettings>) => void;
  resetToSampleData: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'seatserve_user',
  MENU: 'seatserve_menu',
  TABLES: 'seatserve_tables',
  RESERVATIONS: 'seatserve_reservations',
  QUEUE: 'seatserve_queue',
  ORDERS: 'seatserve_orders',
  CART: 'seatserve_cart',
  SETTINGS: 'seatserve_settings',
  COUPON: 'seatserve_coupon',
  OFFERS: 'seatserve_offers',
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or fallback to initial data
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [queue, setQueue] = useState<QueueEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUEUE);
    return saved ? JSON.parse(saved) : INITIAL_QUEUE;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_SETTINGS;
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.COUPON) || '';
  });

  const [activeSlotOffers, setActiveSlotOffers] = useState<ReleasedSlotOffer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPON, couponCode);
  }, [couponCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(activeSlotOffers));
  }, [activeSlotOffers]);

  // Toast manager
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch demo user role
  const switchUserRole = (role: UserRole) => {
    const matched = INITIAL_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addToast('Role Switched', `Active view changed to ${role.toUpperCase()}: ${matched.name}`, 'info');
    }
  };

  // Cart operations
  const discountRate = couponCode === 'WELCOME10' ? 0.1 : couponCode === 'FEAST50' ? 0.15 : 0;

  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartDiscount = Math.round(cartSubtotal * discountRate);
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartGst = Math.round((taxableAmount * settings.gstPercent) / 100);
  const cartServiceCharge = Math.round((taxableAmount * settings.serviceChargePercent) / 100);
  const cartTotal = taxableAmount + cartGst + cartServiceCharge;

  const addToCart = (menuItem: MenuItem, customization: CartItemCustomization, quantity: number) => {
    if (!menuItem.isAvailable) {
      addToast('Dish Unavailable', `${menuItem.name} is currently sold out and cannot be added.`, 'error');
      return false;
    }

    const itemTotal = customization.unitPrice * quantity;
    const newItem: CartItem = {
      id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      menuItem,
      quantity,
      customization,
      itemTotal,
    };

    setCart((prev) => [...prev, newItem]);
    addToast('Added to Cart', `${quantity}x ${menuItem.name} added to your order`, 'success');
    return true;
  };

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: item.customization.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast('Item Removed', 'The item was removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME10' || cleanCode === 'FEAST50') {
      setCouponCode(cleanCode);
      addToast('Coupon Applied', `Code ${cleanCode} applied successfully!`, 'success');
      return true;
    } else {
      addToast('Invalid Coupon', 'Valid demo codes: WELCOME10 (10% off), FEAST50 (15% off)', 'warning');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    addToast('Coupon Removed', 'Discount removed.', 'info');
  };

  // Table availability logic
  const getAvailableTablesForParty = (partySize: number, date: string, timeSlot: string) => {
    // Find confirmed reservations on same date & timeSlot
    const busyTableIds = new Set(
      reservations
        .filter(
          (r) =>
            r.date === date &&
            r.timeSlot === timeSlot &&
            (r.status === 'Confirmed' || r.status === 'Seated' || r.status === 'Arrived') &&
            r.assignedTableId
        )
        .map((r) => r.assignedTableId!)
    );

    return tables.filter(
      (t) =>
        t.capacity >= partySize &&
        t.status !== 'Unavailable' &&
        !busyTableIds.has(t.id)
    );
  };

  // Reservation management
  const createReservation = ({
    customerName,
    customerPhone,
    customerEmail,
    date,
    timeSlot,
    partySize,
    seatingPreference,
    specialRequests,
  }: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    partySize: number;
    seatingPreference: SeatingSection;
    specialRequests?: string;
  }): Reservation | null => {
    const candidateTables = getAvailableTablesForParty(partySize, date, timeSlot);

    if (candidateTables.length === 0) {
      addToast(
        'No Tables Available',
        `No tables with capacity for ${partySize} guests are available at ${timeSlot} on ${date}.`,
        'error'
      );
      return null;
    }

    // Prefer section match, otherwise pick smallest matching table to optimize seating
    const sectionMatch = candidateTables.find((t) => t.section === seatingPreference);
    const assignedTable = sectionMatch || candidateTables.sort((a, b) => a.capacity - b.capacity)[0];

    const newResId = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      id: newResId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      timeSlot,
      partySize,
      seatingPreference,
      specialRequests,
      status: 'Confirmed',
      assignedTableId: assignedTable.id,
      hasAdvanceOrder: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Update table status if reservation is today and within current hours
    const today = new Date().toISOString().substring(0, 10);
    if (date === today) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === assignedTable.id
            ? { ...t, status: 'Reserved', currentReservationId: newResId }
            : t
        )
      );
    }

    addToast(
      'Reservation Confirmed',
      `Booking ${newResId} confirmed for ${partySize} guests at Table ${assignedTable.name} (${assignedTable.section})`,
      'success'
    );

    return newReservation;
  };

  const cancelReservation = (reservationId: string, reason: string): boolean => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return false;

    const assignedTableId = target.assignedTableId;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'Cancelled',
              cancelledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              cancellationReason: reason,
            }
          : r
      )
    );

    // Free table status if it was assigned to this booking
    if (assignedTableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === assignedTableId && t.currentReservationId === reservationId
            ? { ...t, status: 'Available', currentReservationId: undefined }
            : t
        )
      );

      // Trigger Waitlist Reassignment logic: check if any waiting queue customer fits this table capacity
      const eligibleQueueCustomer = queue.find(
        (q) => q.status === 'Waiting' && q.partySize <= (tables.find((t) => t.id === assignedTableId)?.capacity || 4)
      );

      if (eligibleQueueCustomer) {
        // Create an offer with an expiry
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newOffer: ReleasedSlotOffer = {
          queueId: eligibleQueueCustomer.id,
          reservationId: target.id,
          tableId: assignedTableId,
          timeSlot: target.timeSlot,
          expiresAt,
        };
        setActiveSlotOffers((prev) => [...prev.filter((o) => o.queueId !== eligibleQueueCustomer.id), newOffer]);

        addToast(
          'Slot Released for Waitlist',
          `Table slot (${target.timeSlot}) released from ${reservationId} is now available for Queue customer ${eligibleQueueCustomer.customerName} (${eligibleQueueCustomer.id}).`,
          'info'
        );
      }
    }

    addToast('Reservation Cancelled', `Booking ${reservationId} has been cancelled.`, 'info');
    return true;
  };

  const updateReservationStatus = (reservationId: string, status: ReservationStatus, tableId?: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            status,
            assignedTableId: tableId || r.assignedTableId,
          };
        }
        return r;
      })
    );

    const res = reservations.find((r) => r.id === reservationId);
    const assignedId = tableId || res?.assignedTableId;

    if (assignedId) {
      if (status === 'Seated') {
        setTables((prev) =>
          prev.map((t) => (t.id === assignedId ? { ...t, status: 'Occupied', currentReservationId: reservationId } : t))
        );
      } else if (status === 'Completed' || status === 'Cancelled') {
        setTables((prev) =>
          prev.map((t) => (t.id === assignedId ? { ...t, status: 'Cleaning', currentReservationId: undefined } : t))
        );
      }
    }

    addToast('Reservation Updated', `Booking ${reservationId} status changed to ${status}.`, 'info');
  };

  // Live Queue algorithm
  const calculateQueueEstimation = (partySize: number) => {
    const waitingGroups = queue.filter((q) => q.status === 'Waiting');
    // Groups ahead requiring similar capacity (within 2 seats)
    const relevantAhead = waitingGroups.filter((q) => Math.abs(q.partySize - partySize) <= 2).length;
    // Matching tables
    const matchingTables = tables.filter((t) => t.capacity >= partySize && t.status !== 'Unavailable');
    const availableNow = matchingTables.filter((t) => t.status === 'Available').length;

    let waitMinutes = 0;
    if (availableNow > relevantAhead) {
      waitMinutes = 5; // Fast turnaround
    } else {
      const diningFactor = settings.averageDiningDurationMinutes;
      // Formula: (relevantAhead * averageDiningDuration / matchingTableCount)
      const baseEstimate = Math.ceil(((relevantAhead + 1) * diningFactor) / Math.max(1, matchingTables.length));
      waitMinutes = Math.max(10, Math.min(90, baseEstimate));
    }

    return {
      waitMinutes,
      groupsAhead: relevantAhead,
      availableTablesMatch: availableNow,
    };
  };

  const joinQueue = (
    customerName: string,
    customerPhone: string,
    partySize: number,
    seatingPreference?: SeatingSection
  ): QueueEntry => {
    const { waitMinutes } = calculateQueueEstimation(partySize);
    const newQueueId = 'Q-' + Math.floor(100 + Math.random() * 900);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: QueueEntry = {
      id: newQueueId,
      customerName,
      customerPhone,
      partySize,
      seatingPreference,
      joinedAt: currentTime,
      estimatedWaitMinutes: waitMinutes,
      status: 'Waiting',
    };

    setQueue((prev) => [...prev, newEntry]);
    addToast(
      'Joined Live Queue',
      `You are in the queue as ${newQueueId}. Estimated wait: ~${waitMinutes} mins for party of ${partySize}.`,
      'success'
    );
    return newEntry;
  };

  const leaveQueue = (queueId: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== queueId));
    setActiveSlotOffers((prev) => prev.filter((o) => o.queueId !== queueId));
    addToast('Left Queue', `Queue token ${queueId} removed.`, 'info');
  };

  const updateQueueStatus = (queueId: string, status: QueueStatus, tableId?: string) => {
    setQueue((prev) =>
      prev.map((q) => {
        if (q.id === queueId) {
          return {
            ...q,
            status,
            assignedTableId: tableId || q.assignedTableId,
          };
        }
        return q;
      })
    );

    if (tableId && status === 'Seated') {
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, status: 'Occupied' } : t))
      );
    }

    addToast('Queue Updated', `Queue ${queueId} is now marked ${status}.`, 'info');
  };

  const offerSlotToQueueCustomer = (queueId: string, reservationId: string, tableId: string, timeSlot: string) => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const offer: ReleasedSlotOffer = {
      queueId,
      reservationId,
      tableId,
      timeSlot,
      expiresAt,
    };
    setActiveSlotOffers((prev) => [...prev.filter((o) => o.queueId !== queueId), offer]);
    setQueue((prev) =>
      prev.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: 'Table Available',
              assignedTableId: tableId,
              offerExpiresAt: expiresAt,
              offeredReservationSlot: { reservationId, tableId, timeSlot },
            }
          : q
      )
    );
    addToast('Waitlist Slot Offered', `Offered released Table ${tableId} to Queue ${queueId}.`, 'success');
  };

  const acceptSlotOffer = (queueId: string) => {
    const target = queue.find((q) => q.id === queueId);
    if (!target || !target.offeredReservationSlot) return;

    const tableId = target.offeredReservationSlot.tableId;
    setQueue((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status: 'Seated', assignedTableId: tableId } : q))
    );
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: 'Occupied' } : t))
    );
    setActiveSlotOffers((prev) => prev.filter((o) => o.queueId !== queueId));
    addToast('Offer Accepted', `Welcome! Table ${tableId} is ready for you.`, 'success');
  };

  const declineSlotOffer = (queueId: string) => {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: 'Waiting',
              assignedTableId: undefined,
              offeredReservationSlot: undefined,
              offerExpiresAt: undefined,
            }
          : q
      )
    );
    setActiveSlotOffers((prev) => prev.filter((o) => o.queueId !== queueId));
    addToast('Offer Declined', `Slot offer declined; queue position retained.`, 'info');
  };

  // Orders Management
  const createOrder = ({
    customerName,
    customerPhone,
    orderType,
    linkedReservationId,
    tableNumber,
    specialInstructions,
    expectedServingTime,
  }: {
    customerName: string;
    customerPhone: string;
    orderType: OrderType;
    linkedReservationId?: string;
    tableNumber?: string;
    specialInstructions?: string;
    expectedServingTime?: string;
  }): Order => {
    const orderId = 'ORD-' + Math.floor(500 + Math.random() * 500);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Max prep time of chosen items
    const estimatedPrepMinutes = cart.reduce(
      (max, item) => Math.max(max, item.menuItem.prepTimeMinutes),
      settings.averagePrepTimeMinutes
    );

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      orderType,
      linkedReservationId,
      tableNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      gstAmount: cartGst,
      serviceChargeAmount: cartServiceCharge,
      discountAmount: cartDiscount,
      discountCode: couponCode || undefined,
      totalAmount: cartTotal,
      specialInstructions,
      expectedServingTime: expectedServingTime || nowTime,
      status: 'Order Placed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedPrepMinutes,
      statusTimestamps: {
        placedAt: nowTime,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If linked to reservation, update reservation
    if (linkedReservationId) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === linkedReservationId ? { ...r, hasAdvanceOrder: true, linkedOrderId: orderId } : r
        )
      );
    }

    clearCart();
    addToast(
      'Order Placed Successfully',
      `Order ${orderId} received by kitchen. Estimated preparation: ~${estimatedPrepMinutes} mins.`,
      'success'
    );
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const timestamps = { ...ord.statusTimestamps };
          if (newStatus === 'Accepted') timestamps.acceptedAt = nowTime;
          if (newStatus === 'Preparing') timestamps.preparingAt = nowTime;
          if (newStatus === 'Ready') timestamps.readyAt = nowTime;
          if (newStatus === 'Served' || newStatus === 'Collected') timestamps.completedAt = nowTime;
          if (newStatus === 'Cancelled') timestamps.cancelledAt = nowTime;

          return {
            ...ord,
            status: newStatus,
            statusTimestamps: timestamps,
          };
        }
        return ord;
      })
    );

    addToast('Kitchen Order Update', `Order ${orderId} is now ${newStatus}.`, 'info');
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'Cancelled',
              statusTimestamps: { ...ord.statusTimestamps, cancelledAt: nowTime },
              specialInstructions: ord.specialInstructions ? `${ord.specialInstructions} [Cancelled: ${reason}]` : `Cancelled: ${reason}`,
            }
          : ord
      )
    );
    addToast('Order Cancelled', `Order ${orderId} has been cancelled.`, 'warning');
  };

  // Table management
  const updateTableStatus = (tableId: string, status: TableStatus, reservationId?: string, orderId?: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status,
              currentReservationId: reservationId !== undefined ? reservationId : t.currentReservationId,
              currentOrderId: orderId !== undefined ? orderId : t.currentOrderId,
            }
          : t
      )
    );
    addToast('Table Updated', `Table ${tableId} changed to ${status}.`, 'info');
  };

  // Menu Admin management
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newId = 'menu-' + Date.now();
    const newDish: MenuItem = { ...item, id: newId };
    setMenuItems((prev) => [newDish, ...prev]);
    addToast('Menu Updated', `New dish "${newDish.name}" added to menu.`, 'success');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((dish) => (dish.id === id ? { ...dish, ...updates } : dish))
    );
    addToast('Menu Updated', `Dish details updated.`, 'info');
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((dish) => {
        if (dish.id === id) {
          const nextState = !dish.isAvailable;
          if (!nextState) {
            // Check if item is in current cart
            const inCart = cart.some((c) => c.menuItem.id === id);
            if (inCart) {
              addToast(
                'Cart Warning',
                `"${dish.name}" was marked sold out. Please review items in your cart.`,
                'warning'
              );
            }
          }
          return { ...dish, isAvailable: nextState };
        }
        return dish;
      })
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((d) => d.id !== id));
    addToast('Dish Deleted', `Dish removed from menu.`, 'info');
  };

  // Admin Settings
  const updateSettings = (updates: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast('Settings Saved', 'Operational settings updated.', 'success');
  };

  const resetToSampleData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setMenuItems(INITIAL_MENU_ITEMS);
    setTables(INITIAL_TABLES);
    setReservations(INITIAL_RESERVATIONS);
    setQueue(INITIAL_QUEUE);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setSettings(INITIAL_ADMIN_SETTINGS);
    setCouponCode('');
    setActiveSlotOffers([]);
    addToast('Reset Complete', 'Database reset to clean initial sample state.', 'success');
  };

  return (
    <RestaurantContext.Provider
      value={{
        currentUser,
        switchUserRole,
        setCurrentUser,
        users: INITIAL_USERS,

        menuItems,
        addMenuItem,
        updateMenuItem,
        toggleItemAvailability,
        deleteMenuItem,

        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        discountRate,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartGst,
        cartServiceCharge,
        cartDiscount,
        cartTotal,

        tables,
        updateTableStatus,
        getAvailableTablesForParty,

        reservations,
        createReservation,
        cancelReservation,
        updateReservationStatus,

        queue,
        joinQueue,
        leaveQueue,
        updateQueueStatus,
        calculateQueueEstimation,
        activeSlotOffers,
        offerSlotToQueueCustomer,
        acceptSlotOffer,
        declineSlotOffer,

        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,

        settings,
        updateSettings,
        resetToSampleData,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
