import React from 'react';
import { useForm } from '@inertiajs/react';
import { X, RefreshCw } from 'lucide-react';

const Create = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    code: '',
    name: '',
    address: '',
    phone: '',
    is_active: true,
  });

  const generateCode = () => {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newCode = `CBG-${randomDigits}`;
    setData('code', newCode);
  };

  const closeModal = () => {
    reset();
    clearErrors();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('branches.store'), {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 text-gray-100">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
          <h2 className="text-lg font-bold text-white">Tambah Cabang Baru</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Kode Cabang</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.code}
                readOnly
                placeholder="Klik tombol untuk buat kode"
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 cursor-not-allowed focus:outline-none"
              />
              <button
                type="button"
                onClick={generateCode}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                Buat Kode
              </button>
            </div>
            {errors.code && <p className="text-xs text-rose-400 mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Cabang</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Contoh: Cabang Utama"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nomor Telepon</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Alamat</label>
            <textarea
              rows="3"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              placeholder="Alamat lengkap cabang..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            {errors.address && <p className="text-xs text-rose-400 mt-1">{errors.address}</p>}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={data.is_active}
              onChange={(e) => setData('is_active', e.target.checked)}
              className="rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-300 select-none">
              Status Cabang Aktif
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan Cabang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;