export type UserRole = 'customer' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type DishCategory = 
  | 'Starters'
  | 'Main Course'
  | 'Biryani'
  | 'Pizza'
  | 'Burgers'
  | 'Desserts'
  | 'Beverages';

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy';
export type PortionSize = 'Half' | 'Full' | 'Regular' | 'Large';

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: DishCategory;
  price: number; // in INR ₹
  rating: number; // e.g. 4.8
  reviewCount: number;
  prepTimeMinutes: number; // e.g. 20
  isVegetarian: boolean;
  isAvailable: boolean;
  image: string;
  hasPortionSizes?: boolean;
  halfPriceMultiplier?: number; // e.g. 0.65
  spiceLevelOptions?: SpiceLevel[];
  defaultSpiceLevel?: SpiceLevel;
  availableAddons?: MenuItemAddon[];
  tags?: string[];
}

export interface CartItemCustomization {
  portionSize?: PortionSize;
  spiceLevel?: SpiceLevel;
  selectedAddons: MenuItemAddon[];
  specialInstructions?: string;
  unitPrice: number;
}

export interface CartItem {
  id: string; // unique item instance id in cart
  menuItem: MenuItem;
  quantity: number;
  customization: CartItemCustomization;
  itemTotal: number;
}

export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Unavailable';
export type SeatingSection = 'Main Dining Hall' | 'Outdoor Terrace' | 'Window View' | 'Private Booth';

export interface Table {
  id: string; // e.g. "T-01"
  name: string;
  capacity: number; // e.g. 2, 4, 6, 8
  section: SeatingSection;
  status: TableStatus;
  currentReservationId?: string;
  currentOrderId?: string;
  expectedFreeTime?: string; // e.g. "14:30"
}

export type ReservationStatus = 
  | 'Confirmed' 
  | 'Arrived' 
  | 'Seated' 
  | 'Completed' 
  | 'Cancelled';

export interface Reservation {
  id: string; // e.g. "RES-7821"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "19:30"
  partySize: number;
  seatingPreference: SeatingSection;
  specialRequests?: string;
  status: ReservationStatus;
  assignedTableId?: string;
  hasAdvanceOrder?: boolean;
  linkedOrderId?: string;
  createdAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  releasedSlotOfferedToQueueId?: string;
}

export type QueueStatus = 'Waiting' | 'Table Available' | 'Seated' | 'Cancelled';

export interface QueueEntry {
  id: string; // e.g. "Q-104"
  customerName: string;
  customerPhone: string;
  partySize: number;
  seatingPreference?: SeatingSection;
  joinedAt: string;
  estimatedWaitMinutes: number;
  status: QueueStatus;
  assignedTableId?: string;
  offerExpiresAt?: string; // for released slot offer
  offeredReservationSlot?: {
    reservationId: string;
    tableId: string;
    timeSlot: string;
  };
}

export type OrderStatus = 
  | 'Order Placed' 
  | 'Accepted' 
  | 'Preparing' 
  | 'Ready' 
  | 'Served' 
  | 'Collected' 
  | 'Cancelled';

export type OrderType = 'Dine-in' | 'Takeaway';

export interface Order {
  id: string; // e.g. "ORD-942"
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  linkedReservationId?: string;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number; // 5% GST
  serviceChargeAmount: number; // 5% Service charge
  discountAmount: number;
  discountCode?: string;
  totalAmount: number;
  specialInstructions?: string;
  expectedServingTime?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedPrepMinutes: number;
  statusTimestamps: {
    placedAt: string;
    acceptedAt?: string;
    preparingAt?: string;
    readyAt?: string;
    completedAt?: string;
    cancelledAt?: string;
  };
}

export interface AdminSettings {
  restaurantName: string;
  openingTime: string; // "11:30"
  closingTime: string; // "23:00"
  slotDurationMinutes: number; // e.g. 90
  averageDiningDurationMinutes: number; // e.g. 60
  averagePrepTimeMinutes: number; // e.g. 25
  cancellationCutoffMinutes: number; // e.g. 60 (free cancellation cutoff)
  autoWaitlistReassignment: boolean;
  serviceChargePercent: number; // 5%
  gstPercent: number; // 5%
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
