import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AnalyticsDrawer } from './components/layout/AnalyticsDrawer';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ArtistListingPage } from './pages/ArtistListingPage';
import { ArtistProfilePage } from './pages/ArtistProfilePage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { useThemeStore } from './store/useThemeStore';

export const App: React.FC = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ArtistListingPage />} />
            <Route path="/artists/:id" element={<ArtistProfilePage />} />
            <Route
              path="/booking-success/:bookingId"
              element={<BookingSuccessPage />}
            />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <AnalyticsDrawer />
      </div>
    </BrowserRouter>
  );
};

export default App;
