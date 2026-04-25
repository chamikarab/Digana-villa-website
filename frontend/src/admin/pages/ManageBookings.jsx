import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  User, 
  CreditCard,
  Download,
  ArrowUpDown,
  Check,
  X,
  Clock
} from 'lucide-react';

const bookings = [
  {
    id: 'BK-1234',
    guest: 'Alice Johnson',
    email: 'alice@example.com',
    villa: 'Sunset Paradise Villa',
    checkIn: '2024-05-10',
    checkOut: '2024-05-15',
    amount: 750,
    status: 'Confirmed',
    payment: 'Paid'
  },
  {
    id: 'BK-1235',
    guest: 'Bob Smith',
    email: 'bob@example.com',
    villa: 'Mountain View Retreat',
    checkIn: '2024-05-12',
    checkOut: '2024-05-14',
    amount: 400,
    status: 'Pending',
    payment: 'Partial'
  },
  {
    id: 'BK-1236',
    guest: 'Charlie Brown',
    email: 'charlie@example.com',
    villa: 'Lakeside Serenity',
    checkIn: '2024-05-20',
    checkOut: '2024-05-25',
    amount: 900,
    status: 'Cancelled',
    payment: 'Refunded'
  },
  {
    id: 'BK-1237',
    guest: 'Diana Prince',
    email: 'diana@example.com',
    villa: 'Sunset Paradise Villa',
    checkIn: '2024-06-01',
    checkOut: '2024-06-07',
    amount: 1050,
    status: 'Confirmed',
    payment: 'Paid'
  },
];

const ManageBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking Management</h2>
          <p className="text-slate-500">View and manage all guest reservations.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Filters Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Search by guest or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={16} />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              <ArrowUpDown size={16} />
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Villa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-900">#{booking.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                        {booking.guest.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{booking.guest}</div>
                        <div className="text-xs text-slate-500">{booking.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-700">{booking.villa}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-medium">{booking.checkIn}</div>
                    <div className="text-xs text-slate-400">to {booking.checkOut}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">${booking.amount}</div>
                    <div className="text-[10px] font-bold text-green-600 uppercase">{booking.payment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 
                      booking.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                      'bg-red-50 text-red-700'
                    }`}>
                      {booking.status === 'Confirmed' && <Check size={12} />}
                      {booking.status === 'Pending' && <Clock size={12} />}
                      {booking.status === 'Cancelled' && <X size={12} />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <Check size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <X size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Showing 1 to 4 of 24 results</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
