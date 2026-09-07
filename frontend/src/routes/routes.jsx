import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import Navbar from '../components/navebar/Navebar'
import LandingPage from '../pages/landingPage/LandingPage'
import AllServicesPage from '../pages/allServices/AllServicesPage'
import ServiceDetailPage from '../pages/serviceDetail/ServiceDetailPage'
import DashboardPage from '../pages/admin/dashboard/DashboardPage'
import BookingsManagerPage from '../pages/admin/bookingsManager/BookingsManagerPage'
import AddBookingManual from '../pages/admin/addBookingManual/AddBookingManual'
import ServicesManagerPage from '../pages/admin/servicesManager/ServicesManagerPage'
import ScheduleManagerPage from '../pages/admin/scheduleManager/ScheduleManagerPage'
import LoginPage from '../pages/login/LoginPage'
import ResetPasswordPage from '../pages/admin/resetPassword/ResetPasswordPage'
import ProtectedRoute from './ProtectedRoute'

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
    </BrowserRouter>
  )
}

export default AppRoutes