import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Home,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useAdminData } from '../context/AdminDataContext';
import { formatLkr } from '../utils/listHelpers';
import { VILLA_NAME } from '../data/defaults';

const Dashboard = () => {
  const { stats, recentBookings, villa, getChartData } = useAdminData();
  const [chartPeriod, setChartPeriod] = useState('6m');
  const chartData = getChartData(chartPeriod === 'year' ? 'year' : '6m');

  const statCards = [
    {
      name: 'Villa status',
      value: villa.status,
      icon: Home,
      change: VILLA_NAME,
      trending: villa.status === 'Available' ? 'up' : 'down',
      lightColor: 'bg-blue-50',
    },
    {
      name: 'Total bookings',
      value: String(stats.totalBookings),
      icon: CalendarCheck,
      change: `${stats.pendingBookings} pending`,
      trending: 'up',
      lightColor: 'bg-green-50',
    },
    {
      name: 'Guest accounts',
      value: String(stats.guestUsers),
      icon: Users,
      change: `${stats.totalUsers} total users`,
      trending: 'up',
      lightColor: 'bg-purple-50',
    },
    {
      name: 'Confirmed revenue',
      value: formatLkr(stats.totalRevenue),
      icon: DollarSign,
      change: `${stats.confirmedBookings} confirmed`,
      trending: stats.totalRevenue > 0 ? 'up' : 'down',
      lightColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">
          Live summary from your saved admin data
          {stats.pendingReviews > 0 ? ` · ${stats.pendingReviews} reviews awaiting approval` : ''}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.lightColor} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-slate-700" aria-hidden />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trending === 'up' ? 'text-green-600' : 'text-amber-600'
                }`}
              >
                {stat.trending === 'up' ? <TrendingUp size={16} aria-hidden /> : <TrendingDown size={16} aria-hidden />}
                <span className="text-xs">{stat.change}</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Revenue trend (LKR)</h3>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500"
              aria-label="Chart period"
            >
              <option value="6m">Last 6 months</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatLkr(Number(value)), 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Recent bookings</h3>
            <Link
              to="/admin/bookings"
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto pr-1">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings yet.</p>
            ) : (
              recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  to="/admin/bookings"
                  className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-700 font-bold">
                    {booking.guest.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{booking.guest}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {booking.id} · {booking.checkIn}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{formatLkr(booking.amount)}</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-50 text-green-700'
                          : booking.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
