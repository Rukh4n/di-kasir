import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Plus, Edit as EditIcon, Trash2, Search, CheckCircle, XCircle, Store, Users, Layers, Package, ShoppingCart, MapPin, Phone, AlertTriangle, X, Eye } from 'lucide-react';
import Create from './Create';
import Edit from './Edit';

const Index = ({ branches = { data: [], links: [] }, filters = {}, flash = {} }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [search, setSearch] = useState(filters.search || '');

  const { delete: destroy, processing } = useForm();

  const handleSearch = () => {
    router.get(
      route('branches.index'),
      { search: search },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBranch(null);
  };

  const openDeleteModal = (branch) => {
    setDeletingBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBranch(null);
  };

  const confirmDelete = () => {
    if (deletingBranch) {
      destroy(route('branches.destroy', deletingBranch.id), {
        onSuccess: () => closeDeleteModal(),
      });
    }
  };

  const branchList = branches?.data || [];

  return (
    <AuthenticatedLayout>
      <Head title="Manajemen Cabang" />

      <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
        {/* Flash Notification */}
        {flash.success && (
          <div className="mb-4 p-4 bg-emerald-950/80 border-l-4 border-emerald-500 text-emerald-200 rounded-r shadow-sm">
            {flash.success}
          </div>
        )}
        {flash.error && (
          <div className="mb-4 p-4 bg-rose-950/80 border-l-4 border-rose-500 text-rose-200 rounded-r shadow-sm">
            {flash.error}
          </div>
        )}

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Store className="w-6 h-6 text-blue-400" /> Manajemen Cabang
            </h1>
            <p className="text-sm text-gray-400 mt-1">Kelola data cabang dan pemantauan relasi data terkait.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kode atau nama cabang..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 shrink-0"
              >
                Cari
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow transition-colors duration-200"
            >
              <Plus className="w-4 h-4" /> Tambah Cabang
            </button>
          </div>
        </div>

        {/* Card Grid View */}
        {branchList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchList.map((branch) => (
              <div
                key={branch.id}
                className="group bg-gray-900/80 hover:bg-gray-900 border border-gray-800/90 hover:border-indigo-500/40 rounded-2xl p-5 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent group-hover:via-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                        {branch.code}
                      </span>
                      <h3 className="text-lg font-bold text-gray-100 group-hover:text-indigo-300 transition-colors mt-2 line-clamp-2">
                        {branch.name}
                      </h3>
                    </div>
                    {branch.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 shrink-0">
                        <CheckCircle className="w-3 h-3" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-400 border border-rose-800/50 shrink-0">
                        <XCircle className="w-3 h-3" /> Nonaktif
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-gray-300 my-4 border-y border-gray-800/80 py-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{branch.phone || '-'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{branch.address || '-'}</span>
                    </div>
                  </div>

                  <div className="bg-gray-950/50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center text-xs mb-2 border border-gray-800/60">
                    <div className="flex flex-col items-center justify-center p-1" title="Pengguna">
                      <Users className="w-4 h-4 text-indigo-400 mb-1" />
                      <span className="font-semibold text-gray-200">{branch.users_count ?? 0}</span>
                      <span className="text-[10px] text-gray-400">User</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1" title="Kategori">
                      <Layers className="w-4 h-4 text-emerald-400 mb-1" />
                      <span className="font-semibold text-gray-200">{branch.categories_count ?? 0}</span>
                      <span className="text-[10px] text-gray-400">Kategori</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1" title="Produk">
                      <Package className="w-4 h-4 text-amber-400 mb-1" />
                      <span className="font-semibold text-gray-200">{branch.products_count ?? 0}</span>
                      <span className="text-[10px] text-gray-400">Produk</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1" title="Transaksi">
                      <ShoppingCart className="w-4 h-4 text-purple-400 mb-1" />
                      <span className="font-semibold text-gray-200">{branch.transactions_count ?? 0}</span>
                      <span className="text-[10px] text-gray-400">Transaksi</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800/80 flex items-center justify-end gap-2">
                  <Link
                    href={route('branches.show', branch.id)}
                    className="p-2 rounded-xl bg-gray-800/60 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 border border-gray-700/50 hover:border-indigo-500/30 transition-all"
                    title="Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => openEditModal(branch)}
                    className="p-2 rounded-xl bg-gray-800/60 hover:bg-amber-600/20 text-gray-400 hover:text-amber-400 border border-gray-700/50 hover:border-amber-500/30 transition-all"
                    title="Edit"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(branch)}
                    className="p-2 rounded-xl bg-gray-800/60 hover:bg-rose-600/20 text-gray-400 hover:text-rose-400 border border-gray-700/50 hover:border-rose-500/30 transition-all"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/40 rounded-2xl p-12 text-center border border-gray-800/80 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-gray-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700/50">
              <Store className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Data Tidak Ditemukan</h3>
            <p className="text-sm text-gray-500">Belum ada data cabang yang tersimpan atau sesuai pencarian.</p>
          </div>
        )}

        {/* Pagination Navigation */}
        {branches.links && branches.links.length > 1 && (
          <div className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              Menampilkan {branches.from || 0} hingga {branches.to || 0} dari {branches.total} data
            </div>
            <div className="flex flex-wrap gap-1">
              {branches.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    link.active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : link.url
                      ? 'text-gray-300 hover:bg-gray-700 border-gray-600'
                      : 'text-gray-600 border-gray-800 pointer-events-none'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Modal Component */}
        <Create isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

        {/* Edit Modal Component */}
        <Edit
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          branch={editingBranch}
        />

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-950/80 border border-rose-800/50 rounded-full text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Konfirmasi Hapus</h3>
                  <p className="text-xs text-gray-400">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-6">
                Apakah Anda yakin ingin menghapus cabang{' '}
                <span className="font-semibold text-white">"{deletingBranch?.name}"</span>? Data yang terhubung dengan cabang ini mungkin akan terpengaruh.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={processing}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={processing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50"
                >
                  {processing ? 'Menghapus...' : 'Hapus Cabang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
