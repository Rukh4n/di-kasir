import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Link, router, usePage } from '@inertiajs/react'
import { Plus, Edit, Trash2, X, Search, Download, Calendar, Filter } from "lucide-react"

const Index = ({ products }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(products.data)

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

  const handleSearch = (e) => setQuery(e.target.value)
  const handleFilter = () => router.get(route('products.index'), { query, startDate, endDate }, { preserveState: true })

  const submitSearch = (page = 1) => {
    router.get(route('products.index'), { query, startDate, endDate, page }, {
      preserveState: true,
      onSuccess: (pageData) => setFilteredProducts(pageData.props.products.data || [])
    })
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); submitSearch() } }

  const exportUrl = route('products.export', { query, startDate, endDate })
  const handleExportClick = (e) => {
    if (user?.role !== 'admin') { e.preventDefault(); setFlashMessage("Kamu bukan admin utama atau pemilik toko"); setShowFlash(true); setTimeout(() => setShowFlash(false), 3000) }
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-2 md:p-4">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h1 className="text-xl font-bold">Daftar Produk</h1>
          <div className="flex flex-col md:flex-row gap-1 items-center md:ml-auto text-sm">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Cari kode, nama atau kategori produk"
              className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
            />
            <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-md">
              <Calendar className="w-4 h-4 text-gray-300" />
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-gray-800 text-gray-100 px-1 py-0.5 rounded-md text-xs" />
            </div>
            <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-md">
              <Calendar className="w-4 h-4 text-gray-300" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-gray-800 text-gray-100 px-1 py-0.5 rounded-md text-xs" />
            </div>
            <button onClick={handleFilter} className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1 text-xs">
              <Filter className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" /> Filter
            </button>
            <button onClick={() => submitSearch()} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 text-xs">
              <Search className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" /> Cari
            </button>
          </div>
        </div>

        {showFlash && (
          <div className={`mb-2 px-3 py-1 rounded-md text-white text-sm transition-opacity duration-1000 ${flash.success ? 'bg-green-600' : flash.error ? 'bg-red-600' : 'bg-yellow-600'} ${showFlash ? 'opacity-100' : 'opacity-0'}`}>
            {flashMessage}
          </div>
        )}

        {/* Add & Export Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-1 text-sm">
          <Link href={route('products.create')} className="self-start md:self-auto">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-3 py-1 flex items-center gap-1 shadow transition-all duration-300 text-xs">
              <Plus className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" /> Tambah Produk
            </button>
          </Link>
          <a href={user?.role === 'admin' ? exportUrl : '#'} onClick={handleExportClick} className={`mt-1 md:mt-0 px-3 py-1 rounded-md flex items-center gap-1 text-xs ${user?.role === 'admin' ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}>
            <Download className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" /> Export Produk
          </a>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl p-3 md:p-4 shadow overflow-x-auto text-sm">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-400">Belum ada data produk.</p>
          ) : (
            <>
              <table className="w-full text-left min-w-[600px] table-auto text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-2 py-1">Kode</th>
                    <th className="px-2 py-1">Nama</th>
                    <th className="px-2 py-1">Kategori</th>
                    <th className="px-2 py-1">Harga</th>
                    <th className="px-2 py-1">Stok</th>
                    <th className="px-2 py-1">Barcode</th>
                    <th className="px-2 py-1">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-700">
                      <td className="px-2 py-1">{product.code}</td>
                      <td className="px-2 py-1">{product.name}</td>
                      <td className="px-2 py-1">{product.category.name}</td>
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
                        <Link href={route('products.edit', product.id)}><Edit className="w-4 h-4 md:w-5 md:h-5 p-1 bg-gray-700 rounded-full" /></Link>
                        <button onClick={() => openDeleteModal(product.id)} className={`transition ${user?.role !== 'admin' ? "cursor-not-allowed opacity-50" : ""}`}><Trash2 className="w-4 h-4 md:w-5 md:h-5 p-1 bg-gray-700 rounded-full" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-4 gap-1 text-xs">
                {products.links.map((link, index) => (
                  <button key={index} disabled={!link.url} onClick={() => link.url && router.visit(link.url)} className={`px-2 py-1 rounded-md ${link.active ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"} ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Delete Modal */}
        {showModal && deleteMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl p-4 w-72 md:w-80 shadow relative">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"><X className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" /></button>
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

export default Index
