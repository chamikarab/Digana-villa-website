import { useState } from 'react';
import { Star, Search, MessageSquare, ThumbsUp, Trash2, CheckCircle, XCircle } from 'lucide-react';

const reviews = [
  { 
    id: 1, 
    guest: 'Alice Johnson', 
    villa: 'Sunset Paradise Villa', 
    rating: 5, 
    comment: 'Absolutely stunning villa! The view was incredible and the service was top-notch. Highly recommended for families.',
    date: '2024-04-10',
    status: 'Approved'
  },
  { 
    id: 2, 
    guest: 'Bob Smith', 
    villa: 'Mountain View Retreat', 
    rating: 4, 
    comment: 'Great place for a quick getaway. The mountain air is so refreshing. Could use some more kitchen supplies though.',
    date: '2024-04-12',
    status: 'Pending'
  },
  { 
    id: 3, 
    guest: 'Charlie Brown', 
    villa: 'Lakeside Serenity', 
    rating: 2, 
    comment: 'The location was good but the cleanliness was not up to standard. Hopefully, they improve this.',
    date: '2024-04-15',
    status: 'Flagged'
  },
];

const ManageReviews = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Guest Reviews</h2>
        <p className="text-slate-500">Monitor and respond to guest feedback.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Search by guest or villa..."
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-50 rounded-lg p-1">
              <button className="px-3 py-1.5 text-sm font-bold bg-white text-primary-600 rounded-md shadow-sm">All</button>
              <button className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700">Pending</button>
              <button className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700">Flagged</button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {review.guest.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{review.guest}</h4>
                        <p className="text-xs text-slate-500 font-medium">{review.villa} • {review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      review.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      review.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {review.status}
                    </span>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors">
                      <MessageSquare size={14} />
                      Reply
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={14} />
                      Featured
                    </button>
                  </div>
                </div>
                <div className="flex md:flex-col justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 md:flex-none p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    <span className="md:hidden text-xs font-bold">Approve</span>
                  </button>
                  <button className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    <span className="md:hidden text-xs font-bold">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
