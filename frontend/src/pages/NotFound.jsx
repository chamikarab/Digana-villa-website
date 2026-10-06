import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">The page you requested does not exist or was moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700"
          >
            Admin dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
