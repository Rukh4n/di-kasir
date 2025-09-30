import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, router, usePage } from '@inertiajs/react'
import { Edit, Trash2, X, Download, Search, ArrowLeft } from "lucide-react"

const Show = ({ category, categories, query }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query || '')

  useEffect(() => {
    if (flash.success || flash.error) {
      setFlashMessage(flash.success || flash.error)
      setShowFlash(true)
      const timer = setTimeout(() => setShowFlash(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [flash])

  const openDeleteModal = (id) => {
    if (user?.role !== 'admin') {
      setFlashMessage("Kamu bukan admin utama atau pemilik toko")
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 3000)
      return
    }
    setSelectedId(id)
    setDeleteMode(true)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedId(null)
    setShowModal(false)
    setDeleteMode(false)
  }

  const handleDelete = () => {
    if (selectedId) {
      router.delete(route('products.destroy', selectedId), {
        onFinish: () => closeModal()
      })
    }
  }

  const handleSearch = (e) => setSearchQuery(e.target.value)
  const submitSearch = () => {
    router.get(route('categories.show', category.id), { query: searchQuery }, { preserveState: true })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch()
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-2 md:p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h1 className="text-xl font-bold">Kategori: {category.name}</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Cari kode atau nama produk"
              className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50 text-sm"
            />
            <button
              onClick={submitSearch}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 text-xs"
            >
              <Search className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" /> Cari
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>

        {showFlash && (
          <div className={`mb-2 px-3 py-1 rounded-md text-white text-sm transition-opacity duration-1000 ${flash.success ? 'bg-green-600' : flash.error ? 'bg-red-600' : 'bg-yellow-600'} ${showFlash ? 'opacity-100' : 'opacity-0'}`}>
            {flashMessage}
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-800 rounded-xl p-3 md:p-4 shadow overflow-x-auto text-sm">
          {category.products.length === 0 ? (
            <p className="text-gray-400">Belum ada produk di kategori ini.</p>
          ) : (
            <table className="w-full text-left min-w-[600px] table-auto text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-2 py-1">Kode</th>
                  <th className="px-2 py-1">Nama</th>
                  <th className="px-2 py-1">Harga</th>
                  <th className="px-2 py-1">Stok</th>
                  <th className="px-2 py-1">Barcode</th>
                  <th className="px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {category.products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700">
                    <td className="px-2 py-1">{product.code}</td>
                    <td className="px-2 py-1">{product.name}</td>
                    <td className="px-2 py-1">{product.price}</td>
                    <td className="px-2 py-1">{product.stock}</td>
                    <td className="px-2 py-1 relative bg-white">
                      {product.barcode ? (
                        <div className="relative bg-white p-1 rounded">
                          <img src={`/storage/${product.barcode}`} alt={product.code} className="w-24 md:w-32 h-10 md:h-12 object-contain bg-white" />
                          <a href={`/storage/${product.barcode}`} download={product.code + '.png'} className="absolute top-1 right-1 p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition" title="Unduh Barcode">
                            <Download className="w-4 h-4 p-1 bg-gray-700 rounded-full" />
                          </a>
                        </div>
                      ) : <span className="text-gray-500 text-sm md:text-base">Tidak ada</span>}
                    </td>
                    <td className="px-2 py-1 flex gap-2">
                      <Link href={route('products.edit', product.id)}>
                        <Edit className="w-4 h-4 md:w-5 md:h-5 p-1 bg-gray-700 rounded-full" />
                      </Link>
                      <button onClick={() => openDeleteModal(product.id)} className={`transition ${user?.role !== 'admin' ? "cursor-not-allowed opacity-50" : ""}`}>
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5 p-1 bg-gray-700 rounded-full" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Modal */}
        {showModal && deleteMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl p-4 w-72 md:w-80 shadow relative">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
                <X className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              </button>
              <h2 className="text-md font-bold mb-2">Konfirmasi Hapus</h2>
              <p className="text-gray-200 mb-4 text-sm">Apakah Anda yakin ingin menghapus produk ini?</p>
              <div className="flex justify-end gap-2">
                <button onClick={closeModal} className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold transition text-xs">Batal</button>
                <button onClick={handleDelete} className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition text-xs">Hapus</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default Show
