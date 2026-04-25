import { Bell, Search, Menu, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm shadow-slate-100">
      <div className="flex items-center gap-4 flex-1">
        <button className="p-2 text-slate-500 lg:hidden">
          <Menu size={20} />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Search bookings, villas, users..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button className="flex items-center gap-2 pl-2 hover:bg-slate-50 rounded-lg transition-colors p-1">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
            <User size={18} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-700 leading-none">Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
