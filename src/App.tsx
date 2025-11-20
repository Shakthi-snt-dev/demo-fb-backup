import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Auth/login'
import Register from './Pages/Auth/register.tsx'
import VerificationSuccessful from './Pages/Auth/VerificationSuccessful'
import ProtectedRoute from './Pages/ProtectedRoute/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './Pages/dashboard/Dashboard'
import POS from './Pages/dashboard/POS'
import Inventory from './Pages/dashboard/Inventory'
import Repairs from './Pages/dashboard/Repairs'
import Customers from './Pages/dashboard/Customers'
import Employees from './Pages/dashboard/Employees'
import Messages from './Pages/dashboard/Messages'
import Reports from './Pages/dashboard/Reports'
import Settings from './Pages/dashboard/settings/Update-Profile.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification-successful" element={<VerificationSuccessful />} />

        {/* private routes - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/pos"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <POS />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/inventory"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Inventory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/repairs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Repairs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Customers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employees"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Employees />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
