import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate('/admin/bookings', { state: { search: q } });
    setSearchTerm('');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm shadow-slate-100">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          type="button"
          className="p-2 text-slate-500 lg:hidden hover:bg-slate-100 rounded-lg"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} aria-hidden />
          </span>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Search bookings (guest or ID)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search bookings"
          />
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
          aria-label="Notifications (demo)"
          title="Notifications coming soon"
        >
          <Bell size={20} aria-hidden />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" aria-hidden />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
            <User size={18} aria-hidden />
          </div>
          <div className="hidden sm:block text-left max-w-[140px]">
            <p className="text-sm font-medium text-slate-700 leading-none truncate">
              {user?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={18} aria-hidden />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
