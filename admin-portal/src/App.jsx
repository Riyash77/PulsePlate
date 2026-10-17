import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import BusTimingsPage from './pages/BusTimingsPage';
import RankingsPage from './pages/RankingsPage';
import BusesPage from './pages/BusesPage';
import DriversPage from './pages/DriversPage';
import RoutesPage from './pages/RoutesPage';
import AttendancePage from './pages/AttendancePage';
import AILogsPage from './pages/AILogsPage';
import GatePassesPage from './pages/GatePassesPage';
import RouteChangesPage from './pages/RouteChangesPage';
import DriverPage from './pages/DriverPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141428',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/driver" element={<DriverPage />} />

          {/* Protected admin/AO routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bus-timings" element={<BusTimingsPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/buses" element={<BusesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/ai-logs" element={<AILogsPage />} />
            <Route path="/gate-passes" element={<GatePassesPage />} />
            <Route path="/route-changes" element={<RouteChangesPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
