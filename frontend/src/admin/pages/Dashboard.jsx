import { 
  Users, 
  Home, 
  CalendarCheck, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', bookings: 4000, revenue: 2400 },
  { name: 'Feb', bookings: 3000, revenue: 1398 },
  { name: 'Mar', bookings: 2000, revenue: 9800 },
  { name: 'Apr', bookings: 2780, revenue: 3908 },
  { name: 'May', bookings: 1890, revenue: 4800 },
  { name: 'Jun', bookings: 2390, revenue: 3800 },
];

const stats = [
  { 
    name: 'Villa Listing', 
    value: '1', 
    icon: Home, 
    change: 'Live', 
    trending: 'up',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50' 
  },
  { 
    name: 'Total Bookings', 
    value: '156', 
    icon: CalendarCheck, 
    change: '+12%', 
    trending: 'up',
    color: 'bg-green-500',
    lightColor: 'bg-green-50'
  },
  { 
    name: 'Total Users', 
    value: '2,450', 
    icon: Users, 
    change: '+18%', 
    trending: 'up',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50'
  },
  { 
    name: 'Total Revenue', 
    value: '$45,200', 
    icon: DollarSign, 
    change: '-3%', 
    trending: 'down',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50'
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.lightColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 text-slate-700`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trending === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Revenue vs Bookings</h3>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
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

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Recent Bookings</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto pr-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=200`} alt="Villa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">Sunset Paradise Villa</h4>
                  <p className="text-xs text-slate-500 font-medium">John Doe • 2 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">$240</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
