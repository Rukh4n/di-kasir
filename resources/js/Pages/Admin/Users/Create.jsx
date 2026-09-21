import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, UserPlus } from 'lucide-react';

const Create = ({ isOpen, onClose, roles = [], branches = [] }) => {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'staff',
    branch_id: '',
  });

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('users.store'), {
      onSuccess: () => handleClose(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[85vh] overflow-y-auto custom-scrollbar">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-950/80 border border-blue-800/50 rounded-full text-blue-400 shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Tambah User Baru</h3>
            <p className="text-xs text-gray-400">Isi formulir berikut untuk menambahkan akun pengguna.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Masukkan nama pengguna"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Role</label>
            <select
              value={data.role}
              onChange={(e) => setData('role', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.length > 0 ? (
                roles.map((r) => {
                  const roleValue = (r.name || r.value || r).toString().toLowerCase();
                  const roleLabel = r.label || r.name || roleValue.charAt(0).toUpperCase() + roleValue.slice(1);
                  return (
                    <option key={r.id || roleValue} value={roleValue}>
                      {roleLabel}
                    </option>
                  );
                })
              ) : (
                <>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </>
              )}
            </select>
            {errors.role && <p className="text-xs text-rose-400 mt-1">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Cabang</label>
            <select
              value={data.branch_id}
              onChange={(e) => setData('branch_id', e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Cabang</option>
              {branches.map((b) => (
                <option key={b.id || b.value || b} value={b.id || b.value || b}>
                  {b.name || b.label || b}
                </option>
              ))}
            </select>
            {errors.branch_id && <p className="text-xs text-rose-400 mt-1">{errors.branch_id}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Konfirmasi Password</label>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700 mt-6 sticky bottom-0 bg-gray-800 pb-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={processing}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? 'Menyimpan...' : 'Simpan User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;