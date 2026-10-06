import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Home, CalendarDays, Users, Star, LogOut, ChevronRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Villa', path: '/admin/villas', icon: Home },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-30',
        'fixed lg:static inset-y-0 left-0 transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      <div className="p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <Home size={24} aria-hidden />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">Digana Villa</h1>
            <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
          </div>
        </div>
        <button
          type="button"
          className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-lg"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600',
                    )}
                    aria-hidden
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive ? <ChevronRight size={16} className="text-primary-500" aria-hidden /> : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
              {(user?.email?.[0] || 'A').toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@diganavilla.com'}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-red-500" aria-hidden />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
