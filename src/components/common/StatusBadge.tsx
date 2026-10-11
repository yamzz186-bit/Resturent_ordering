import React from 'react';
import {
  OrderStatus,
  ReservationStatus,
  QueueStatus,
  TableStatus,
} from '../../types';

type AnyStatus = OrderStatus | ReservationStatus | QueueStatus | TableStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      // Positive / Ready / Seated / Confirmed / Available
      case 'Confirmed':
      case 'Available':
      case 'Ready':
      case 'Seated':
      case 'Collected':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';

      // Active in kitchen / Waiting / Reserved
      case 'Order Placed':
      case 'Accepted':
      case 'Preparing':
      case 'Waiting':
      case 'Reserved':
        return 'bg-amber-50 text-amber-900 border-amber-200';

      // In-service / Occupied
      case 'Occupied':
      case 'Arrived':
      case 'Table Available':
        return 'bg-[#F2EFE9] text-[#1B4332] border-[#C8D6CD]';

      // Completed / Served / Cleaning
      case 'Served':
      case 'Completed':
      case 'Cleaning':
        return 'bg-stone-100 text-stone-700 border-stone-200';

      // Negative / Cancelled / Unavailable
      case 'Cancelled':
      case 'Unavailable':
        return 'bg-rose-50 text-rose-800 border-rose-200';

      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${pad} ${getStyles()} whitespace-nowrap`}
    >
      {status}
    </span>
  );
};
