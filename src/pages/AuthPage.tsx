import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Eye, EyeOff, ShieldCheck, UserCheck, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { setCurrentUser, users, addToast } = useRestaurant();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleQuickDemoLogin = (role: UserRole) => {
    const demoUser = users.find((u) => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      addToast('Welcome', `Signed in as ${demoUser.name} (${role.toUpperCase()})`, 'success');
      if (role === 'staff') navigate('/staff');
      else if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register' && (!name || !phone)) {
      setErrorMessage('Please provide your full name and contact phone.');
      return;
    }

    // Simulated login / register
    const newUser = {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name: mode === 'register' ? name : (email.split('@')[0] || 'Aarav Sharma'),
      email,
      phone: phone || '+91 98765 43210',
      role: selectedRole,
    };

    setCurrentUser(newUser);
    setSuccessMessage(
      mode === 'login'
        ? `Successfully logged in as ${newUser.name}.`
        : `Account created for ${newUser.name}. Welcome!`
    );

    addToast(
      'Authenticated',
      `Welcome to Seat & Serve, ${newUser.name}`,
      'success'
    );

    setTimeout(() => {
      if (selectedRole === 'staff') navigate('/staff');
      else if (selectedRole === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      {/* Brand logo & header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B4332] text-white shadow-xs">
          <Utensils className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-stone-900">
          {mode === 'login' ? 'Welcome Back to Seat & Serve' : 'Create Your Guest Account'}
        </h1>
        <p className="text-xs text-stone-500">
          Access your table reservations, order tracking, and live queue status.
        </p>
      </div>

      {/* Demo Credentials Quick-Select Pill Box */}
      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            1-Click Demo Accounts
          </span>
          <span className="text-[11px] text-stone-400">Instant Evaluation</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('customer')}
            className="flex flex-col items-center justify-center rounded-lg border border-stone-200 p-2.5 hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-colors text-center"
          >
            <UserCheck className="h-4 w-4 text-[#1B4332]" />
            <span className="mt-1 text-xs font-semibold text-stone-800">Customer</span>
            <span className="text-[10px] text-stone-400">Aarav S.</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('staff')}
            className="flex flex-col items-center justify-center rounded-lg border border-stone-200 p-2.5 hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-colors text-center"
          >
            <Utensils className="h-4 w-4 text-[#C85A32]" />
            <span className="mt-1 text-xs font-semibold text-stone-800">Staff / Host</span>
            <span className="text-[10px] text-stone-400">Pooja (Hostess)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="flex flex-col items-center justify-center rounded-lg border border-stone-200 p-2.5 hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-colors text-center"
          >
            <ShieldCheck className="h-4 w-4 text-[#163829]" />
            <span className="mt-1 text-xs font-semibold text-stone-800">Admin</span>
            <span className="text-[10px] text-stone-400">Vikramaditya</span>
          </button>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {/* Toggle Mode Segmented Control */}
        <div className="flex rounded-lg bg-stone-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-2 transition-all ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md py-2 transition-all ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success alert */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-semibold text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden bg-white"
                >
                  <option value="customer">Customer / Guest</option>
                  <option value="staff">Restaurant Staff</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-stone-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aarav@example.com"
              className="mt-1 w-full rounded-lg border border-stone-200 p-2.5 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-stone-700">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => addToast('Reset Simulated', 'Password reset email sent to demo address.', 'info')}
                  className="text-[11px] text-[#1B4332] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-stone-200 p-2.5 pr-10 text-stone-900 focus:border-[#1B4332] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#1B4332] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#25553E] transition-colors"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Create My Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-stone-400">
          Simulated authentication. No payment or real credentials required.
        </p>
      </div>
    </div>
  );
};
