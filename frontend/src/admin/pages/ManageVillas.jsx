import { useState } from 'react';
import { 
  Search, 
  Edit2, 
  Eye, 
  MapPin, 
  Users, 
  Bed
} from 'lucide-react';

const villas = [
  { 
    id: 1, 
    name: 'Sunset Paradise Villa', 
    location: 'Digana, Kandy', 
    price: 150, 
    capacity: 6, 
    rooms: 3, 
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
];

const ManageVillas = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Villa</h2>
          <p className="text-slate-500">Update details for your villa listing.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Search villa details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-auto">
            <option>All Status</option>
            <option>Available</option>
            <option>Booked</option>
            <option>Maintenance</option>
          </select>
          <select className="bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-auto">
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Villa Card */}
      <div className="grid grid-cols-1 gap-6">
        {villas.map((villa) => (
          <div key={villa.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group max-w-2xl">
            <div className="relative h-48 overflow-hidden">
              <img src={villa.image} alt={villa.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  villa.status === 'Available' ? 'bg-green-500 text-white' : 
                  villa.status === 'Booked' ? 'bg-amber-500 text-white' : 
                  'bg-red-500 text-white'
                }`}>
                  {villa.status}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:bg-white transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors truncate flex-1">{villa.name}</h3>
                <span className="text-primary-600 font-bold ml-2">${villa.price}<span className="text-slate-400 text-xs font-medium">/night</span></span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                <MapPin size={14} />
                {villa.location}
              </div>
              <div className="flex items-center justify-between py-3 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-sm font-semibold">{villa.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Bed size={16} className="text-slate-400" />
                    <span className="text-sm font-semibold">{villa.rooms}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageVillas;
