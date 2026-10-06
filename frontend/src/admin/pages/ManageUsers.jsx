import { useEffect, useMemo, useState } from 'react';
import { Search, UserPlus, Mail, Shield, Trash2, Edit, Download } from 'lucide-react';
import ListPagination from '../components/ListPagination';
import { useAdminData } from '../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { exportToCsv, formatDate, paginate } from '../utils/listHelpers';

const ROLES = ['All', 'Admin', 'Guest'];

const ManageUsers = () => {
  const { users, addUser, patchUser, removeUser } = useAdminData();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Guest' });

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return users
      .filter((u) => {
        const matchesSearch =
          !query ||
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query);
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => b.joined.localeCompare(a.joined));
  }, [users, searchTerm, roleFilter]);

  const { items: paginatedUsers, totalPages, page: safePage, rangeStart, rangeEnd } = paginate(
    filteredUsers,
    page,
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const name = newUser.name.trim();
    const email = newUser.email.trim().toLowerCase();
    if (!name || !email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    try {
      await addUser({ name, email, role: newUser.role });
      setNewUser({ name: '', email: '', role: 'Guest' });
      setShowAddForm(false);
      showToast(`${name} added.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleEdit = async (user) => {
    if (user.email === 'admin@diganavilla.com') {
      showToast('The primary admin account cannot change role here.', 'error');
      return;
    }
    const nextRole = user.role === 'Guest' ? 'Admin' : 'Guest';
    if (nextRole === 'Admin' && !window.confirm(`Promote ${user.name} to Admin?`)) return;
    try {
      await patchUser(user.id, { role: nextRole });
      showToast(`${user.name} is now ${nextRole}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Remove ${user.name} (${user.email})?`)) return;
    try {
      await removeUser(user.id);
      showToast(`${user.name} removed.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleExport = () => {
    exportToCsv(
      `digana-users-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Name', 'Email', 'Role', 'Joined'],
      filteredUsers.map((u) => [u.name, u.email, u.role, u.joined]),
    );
    showToast('Users exported.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500">Manage administrator and guest accounts.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredUsers.length === 0}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
            aria-label="Export users as CSV"
          >
            <Download size={20} aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary-200"
          >
            <UserPlus size={20} aria-hidden />
            Add User
          </button>
        </div>
      </div>

      {showAddForm ? (
        <form
          onSubmit={handleAddUser}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="new-user-name">
              Name
            </label>
            <input
              id="new-user-name"
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="new-user-email">
              Email
            </label>
            <input
              id="new-user-email"
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="new-user-role">
              Role
            </label>
            <select
              id="new-user-role"
              value={newUser.role}
              onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}
              className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium"
            >
              <option value="Guest">Guest</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700"
          >
            Save
          </button>
        </form>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative max-w-md w-full flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} aria-hidden />
            </span>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Filter by role"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role === 'All' ? 'All roles' : role}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">Admin and guest user accounts</caption>
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-medium">No users match your search or filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('All');
                      }}
                      className="mt-2 text-sm text-primary-600 font-semibold hover:underline"
                    >
                      Clear search and filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {user.role === 'Admin' ? <Shield size={12} aria-hidden /> : <Mail size={12} aria-hidden />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {formatDate(user.joined)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          disabled={user.email === 'admin@diganavilla.com'}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors disabled:opacity-40"
                          aria-label={`Edit ${user.name}`}
                          title="Toggle role"
                        >
                          <Edit size={16} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={user.email === 'admin@diganavilla.com'}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors disabled:opacity-40"
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 size={16} aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ListPagination
          page={safePage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={filteredUsers.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
