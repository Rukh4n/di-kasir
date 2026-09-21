import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, router, usePage } from '@inertiajs/react'
import { Edit, Trash2, X, Download, Search, ArrowLeft, AlertCircle, CheckCircle2, PackageX } from "lucide-react"

const Show = ({ category, query }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [flashType, setFlashType] = useState(flash.success ? 'success' : flash.error ? 'error' : 'warning')
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState(query || '')

  useEffect(() => {
    if (flash.success || flash.error) {
      setFlashMessage(flash.success || flash.error)
      setFlashType(flash.success ? 'success' : 'error')
      setShowFlash(true)
      const timer = setTimeout(() => setShowFlash(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [flash])

  const openDeleteModal = (id) => {
    if (user?.role !== 'admin') {
      setFlashMessage("Akses ditolak: Anda bukan admin utama atau pemilik toko.")
      setFlashType('warning')
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 3000)
      return
    }
    setSelectedId(id)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedId(null)
    setShowModal(false)
  }

  const handleDelete = () => {
    if (selectedId) {
      router.delete(route('products.destroy', selectedId), {
        onFinish: () => closeModal()
      })
    }
  }

  const submitSearch = () => {
    router.get(route('categories.show', category.id), { query: searchQuery }, { preserveState: true })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch()
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3.5 py-2 rounded-lg transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          </div>

          {/* Header & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/60 border border-slate-700/50 p-5 rounded-2xl backdrop-blur-sm shadow-xl">
            <div>
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Kategori Produk</span>
              <h1 className="text-2xl font-extrabold text-white mt-0.5">{category.name}</h1>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Cari kode atau nama produk..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <button
                onClick={submitSearch}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 shrink-0"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Flash Notification */}
          {showFlash && (
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg transition-all duration-300 ${
                flashType === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                  : flashType === 'error'
                  ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
              }`}
            >
              {flashType === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{flashMessage}</span>
            </div>
          )}

          {/* Product Data Table */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            {category.products.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="inline-flex p-3 bg-slate-800 rounded-2xl text-slate-500">
                  <PackageX className="w-8 h-8" />
                </div>
                <p className="text-slate-400 text-base font-medium">Belum ada produk di kategori ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700/60 uppercase text-[11px] tracking-wider">
                      <th className="px-5 py-4">Kode</th>
                      <th className="px-5 py-4">Nama Produk</th>
                      <th className="px-5 py-4">Harga</th>
                      <th className="px-5 py-4">Stok</th>
                      <th className="px-5 py-4">Barcode</th>
                      <th className="px-5 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40">
                    {category.products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4 font-mono text-slate-300 text-xs">{product.code}</td>
                        <td className="px-5 py-4 font-semibold text-white">{product.name}</td>
                        <td className="px-5 py-4 font-medium text-indigo-300">{formatCurrency(product.price)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 10
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : product.stock > 0
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {product.stock} pcs
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {product.barcode ? (
                            <div className="inline-flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200">
                              <img
                                src={`/storage/${product.barcode}`}
                                alt={product.code}
                                className="h-9 object-contain"
                              />
                              <a
                                href={`/storage/${product.barcode}`}
                                download={`${product.code}.png`}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                title="Unduh Barcode"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-xs italic">Tidak ada barcode</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={route('products.edit', product.id)}
                              className="p-2 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                              title="Edit Produk"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(product.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                user?.role !== 'admin'
                                  ? 'text-slate-600 cursor-not-allowed'
                                  : 'text-slate-300 hover:text-rose-400 hover:bg-rose-500/10'
                              }`}
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 text-rose-400">
                  <div className="p-2.5 bg-rose-500/10 rounded-xl">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Konfirmasi Hapus</h2>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all shadow-lg shadow-rose-600/20 text-sm"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Show