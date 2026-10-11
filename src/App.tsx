import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { ReservationPage } from './pages/ReservationPage';
import { QueuePage } from './pages/QueuePage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CancellationPage } from './pages/CancellationPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1A202C]">
          {/* Top Demo Simulation Bar */}
          <RoleSwitcher />

          {/* Sticky Navigation Bar */}
          <Navbar />

          {/* Main Viewport Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/queue" element={<QueuePage />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/orders/track" element={<OrderTrackingPage />} />
              <Route path="/cancellation" element={<CancellationPage />} />
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notification Stack */}
          <ToastContainer />
        </div>
      </BrowserRouter>
    </RestaurantProvider>
  );
}
