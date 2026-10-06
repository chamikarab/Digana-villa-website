import { Link } from 'react-router-dom';
import { Home, MapPin, ArrowRight, Shield } from 'lucide-react';
import { VILLA_NAME } from '../admin/data/defaults';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 text-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Home size={22} aria-hidden />
          </div>
          <span className="font-bold text-lg">{VILLA_NAME}</span>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
        >
          <Shield size={16} aria-hidden />
          Admin login
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <p className="text-primary-300 font-semibold text-sm mb-4">Digana, Kandy · Sri Lanka</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mb-6">
          Your private hillside retreat in the heart of Sri Lanka
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mb-10 leading-relaxed">
          {VILLA_NAME} offers a single exclusive property with pool, garden views, and space for families
          and small groups. Book your stay online or manage reservations in the admin portal.
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm">
            <MapPin size={16} aria-hidden />
            Digana, Kandy
          </span>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Book your stay
            <ArrowRight size={18} aria-hidden />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Shield size={16} aria-hidden />
            Admin
          </Link>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-8 text-slate-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} {VILLA_NAME}. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
