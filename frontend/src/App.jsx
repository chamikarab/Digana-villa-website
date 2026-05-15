import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/auth/Login';
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ManageVillas from './admin/pages/ManageVillas';
import ManageBookings from './admin/pages/ManageBookings';
import ManageUsers from './admin/pages/ManageUsers';
import ManageReviews from './admin/pages/ManageReviews';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="villas" element={<ManageVillas />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="reviews" element={<ManageReviews />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
