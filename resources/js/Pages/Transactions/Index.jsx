import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { router, usePage } from '@inertiajs/react'
import { Plus, Printer, Trash2, X, Search, Calendar, Filter, Download } from "lucide-react"
import Show from './Show'

const Index = ({ transactions }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [showModal, setShowModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (flash.success || flash.error) {
      setFlashMessage(flash.success || flash.error)
      setShowFlash(true)
      const timer = setTimeout(() => setShowFlash(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [flash])

  const openDeleteModal = (transaction) => {
    if (user?.role !== 'admin') {
      setFlashMessage("Kamu bukan admin utama atau pemilik toko")
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 3000)
      return
    }
    setSelectedTransaction(transaction)
    setDeleteMode(true)
    setShowModal(true)
  }

  const openPrintModal = (transaction) => {
    setSelectedTransaction(transaction)
    setDeleteMode(false)
    setShowDetail(true)
  }

  const closeModal = () => {
    setSelectedTransaction(null)
    setShowModal(false)
    setShowDetail(false)
  }

  const handleDelete = () => {
    if (selectedTransaction) {
      router.delete(route('transactions.destroy', selectedTransaction.id), {
        onFinish: () => closeModal()
      })
    }
  }

  const handleSearch = (e) => setQuery(e.target.value)
  const handleFilter = () => router.get(route('transactions.index'), { query, startDate, endDate }, { preserveState: true })
  const exportUrl = route('transactions.export', { query, startDate, endDate })
  const handleExportClick = (e) => {
    if (user?.role !== 'admin') {
      e.preventDefault()
      setFlashMessage("Kamu bukan admin utama atau pemilik toko")
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 3000)
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-2 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h1 className="text-xl font-bold">Daftar Transaksi</h1>
          <div className="flex flex-col md:flex-row gap-1 items-center md:ml-auto text-sm">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Cari invoice atau item"
              className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
            />
            <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-md">
              <Calendar className="w-4 h-4 text-gray-300" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-800 text-gray-100 px-1 py-0.5 rounded-md text-xs"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-md">
              <Calendar className="w-4 h-4 text-gray-300" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-800 text-gray-100 px-1 py-0.5 rounded-md text-xs"
              />
            </div>
            <button
              onClick={handleFilter}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1 text-xs"
            >
              <Filter className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              Filter
            </button>
            <button
              onClick={handleFilter}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 text-xs"
            >
              <Search className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              Cari
            </button>
          </div>
        </div>

        {showFlash && (
          <div
            className={`mb-2 px-3 py-1 rounded-md text-white text-sm transition-opacity duration-1000 ${
              flash.success ? 'bg-green-600' : flash.error ? 'bg-red-600' : 'bg-yellow-600'
            } ${showFlash ? 'opacity-100' : 'opacity-0'}`}
          >
            {flashMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-1 text-sm">
          <a href={route('transactions.create')} className="self-start md:self-auto">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-3 py-1 flex items-center gap-1 shadow transition-all duration-300 text-xs"
            >
              <Plus className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              Tambah
            </button>
          </a>

          <a
            href={user?.role === 'admin' ? exportUrl : '#'}
            onClick={handleExportClick}
            className={`mt-1 md:mt-0 px-3 py-1 rounded-md flex items-center gap-1 text-xs ${
              user?.role === 'admin'
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
            Export
          </a>
        </div>

        <div className="bg-gray-800 rounded-xl p-3 md:p-4 shadow overflow-x-auto text-sm">
          {transactions.data.length === 0 ? (
            <p className="text-gray-400">Belum ada data transaksi.</p>
          ) : (
            <>
              <table className="w-full text-left min-w-[600px] table-auto text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-2 py-1">Invoice</th>
                    <th className="px-2 py-1">Items</th>
                    <th className="px-2 py-1">Harga Item</th>
                    <th className="px-2 py-1">Total</th>
                    <th className="px-2 py-1">Tunai</th>
                    <th className="px-2 py-1">Kembalian</th>
                    <th className="px-2 py-1">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.data.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-700">
                      <td className="px-2 py-1">{transaction.invoice_number}</td>
                      <td className="px-2 py-1">
                        {transaction.items.map((item, idx) => (
                          <div key={idx}>{item.name} (x{item.qty})</div>
                        ))}
                      </td>
                      <td className="px-2 py-1">
                        {transaction.item_prices.map((price, idx) => (
                          <div key={idx}>{price}</div>
                        ))}
                      </td>
                      <td className="px-2 py-1">{transaction.total_price}</td>
                      <td className="px-2 py-1">{transaction.cash_received}</td>
                      <td className="px-2 py-1">{transaction.change}</td>
                      <td className="px-2 py-1 flex gap-1">
                        <button
                          onClick={() => openPrintModal(transaction)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md transition"
                        >
                          <Printer className="w-3.5 h-3.5 p-0.5 bg-gray-700 rounded-full" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(transaction)}
                          className={`p-1 rounded-md transition ${
                            user?.role === 'admin'
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-gray-600 text-gray-400"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5 p-0.5 bg-gray-700 rounded-full" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4 gap-1 text-xs">
                {transactions.links.map((link, index) => (
                  <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url)}
                    className={`px-2 py-1 rounded-md ${
                      link.active
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {showModal && selectedTransaction && deleteMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl p-4 w-72 md:w-80 shadow relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              </button>
              <h2 className="text-md font-bold mb-2">Konfirmasi Hapus</h2>
              <p className="text-gray-200 mb-4 text-sm">Apakah Anda yakin ingin menghapus transaksi ini?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold transition text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition text-xs"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetail && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl p-4 w-full max-w-xl shadow relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5 p-0.5 bg-gray-700 rounded-full" />
              </button>
              <div className="max-h-[80vh] overflow-y-auto">
                <Show transaction={selectedTransaction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
