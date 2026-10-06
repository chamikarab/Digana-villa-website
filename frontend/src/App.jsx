import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import HomePage from './pages/Home';
import Book from './pages/Book';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import AdminLayout from './admin/layouts/AdminLayout';

const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ManageVillas = lazy(() => import('./admin/pages/ManageVillas'));
const ManageBookings = lazy(() => import('./admin/pages/ManageBookings'));
const ManageUsers = lazy(() => import('./admin/pages/ManageUsers'));
const ManageReviews = lazy(() => import('./admin/pages/ManageReviews'));

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <p className="text-slate-500 font-medium">Loading...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<Book />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="villas"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ManageVillas />
                    </Suspense>
                  }
                />
                <Route
                  path="bookings"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ManageBookings />
                    </Suspense>
                  }
                />
                <Route
                  path="users"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ManageUsers />
                    </Suspense>
                  }
                />
                <Route
                  path="reviews"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ManageReviews />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
