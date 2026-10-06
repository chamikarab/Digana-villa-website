import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminDataProvider, useAdminData } from '../context/AdminDataContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function AdminShell({ sidebarOpen, setSidebarOpen }) {
  const { isLoading, error } = useAdminData();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[50vh] text-slate-500 font-medium">
                Loading admin data...
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-red-700">
                <p className="font-bold">Could not load data</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-sm mt-2">Ensure the backend is running on port 5000.</p>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
  );
}

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminDataProvider>
      <AdminShell sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </AdminDataProvider>
  );
};

export default AdminLayout;
