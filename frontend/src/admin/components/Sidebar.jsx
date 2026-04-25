import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  CalendarDays, 
  Users, 
  Star, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Villa', path: '/admin/villas', icon: Home },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
          <Home size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-lg leading-tight">Digana Villa</h1>
          <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-primary-50 text-primary-700 shadow-sm shadow-primary-50" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={cn(
                    "transition-colors",
                    isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-primary-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@diganavilla.com</p>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group">
          <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
