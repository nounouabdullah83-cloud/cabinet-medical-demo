import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import Navbar from '../components/navebar/Navebar'
import ProtectedRoute from './ProtectedRoute'

// Eagerly loaded public primary page
import LandingPage from '../pages/landingPage/LandingPage'

// Lazy loaded secondary & admin pages for optimal bundle size
const AllServicesPage = lazy(() => import('../pages/allServices/AllServicesPage'))
const ServiceDetailPage = lazy(() => import('../pages/serviceDetail/ServiceDetailPage'))
const DashboardPage = lazy(() => import('../pages/admin/dashboard/DashboardPage'))
const BookingsManagerPage = lazy(() => import('../pages/admin/bookingsManager/BookingsManagerPage'))
const AddBookingManual = lazy(() => import('../pages/admin/addBookingManual/AddBookingManual'))
const ServicesManagerPage = lazy(() => import('../pages/admin/servicesManager/ServicesManagerPage'))
const ScheduleManagerPage = lazy(() => import('../pages/admin/scheduleManager/ScheduleManagerPage'))
const LoginPage = lazy(() => import('../pages/login/LoginPage'))
const ResetPasswordPage = lazy(() => import('../pages/admin/resetPassword/ResetPasswordPage'))

function RouteFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem',
      color: '#475569',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid #e2e8f0',
        borderTopColor: '#0ea5e9',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading...</span>
    </div>
  )
}

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
          <Route path="/services" element={<AllServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/bookings" element={<BookingsManagerPage />} />
            <Route path="/admin/bookings/add" element={<AddBookingManual />} />
            <Route path="/admin/services" element={<ServicesManagerPage />} />
            <Route path="/admin/schedule" element={<ScheduleManagerPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRoutes