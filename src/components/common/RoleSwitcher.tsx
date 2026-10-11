import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { UserRole } from '../../types';
import { Shield, Users, User, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchUserRole, resetToSampleData } = useRestaurant();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    switchUserRole(role);
    if (role === 'staff') {
      navigate('/staff');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-[#163829] text-stone-200 border-b border-[#25553E] text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
            Demo Simulation Mode
          </span>
          <span className="hidden sm:inline text-stone-400">·</span>
          <span className="hidden sm:inline text-stone-300">
            Active: <strong className="text-white font-medium">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-stone-400">Switch Role:</span>
          <div className="flex items-center gap-1 rounded bg-[#0F261C] p-0.5 border border-[#25553E]">
            <button
              onClick={() => handleRoleSelect('customer')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                currentUser.role === 'customer'
                  ? 'bg-[#2A6A4E] text-white font-medium shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <User className="h-3 w-3" />
              <span>Customer</span>
            </button>

            <button
              onClick={() => handleRoleSelect('staff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                currentUser.role === 'staff'
                  ? 'bg-[#2A6A4E] text-white font-medium shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Users className="h-3 w-3" />
              <span>Staff</span>
            </button>

            <button
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-[#2A6A4E] text-white font-medium shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Shield className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>

          <button
            onClick={resetToSampleData}
            title="Reset demo data to initial state"
            className="flex items-center gap-1 px-2 py-1 text-stone-300 hover:text-white hover:bg-[#25553E] rounded transition-colors ml-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
