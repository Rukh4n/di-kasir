import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { router } from '@inertiajs/react'
import { Trash2, CheckSquare, Square } from 'lucide-react'

const Index = ({ transactions }) => {
  const [selectedTransactions, setSelectedTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)

  const toggleSelect = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter((tid) => tid !== id))
    } else {
      setSelectedTransactions([...selectedTransactions, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(transactions.map((t) => t.id))
    }
  }

  const handleBulkDelete = () => {
    if (selectedTransactions.length === 0) return
    router.post(route('options.bulkDelete'), { ids: selectedTransactions })
    setShowModal(false)
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-3 md:p-4 text-xs">
        <h1 className="text-lg font-bold mb-4">Daftar Transaksi</h1>

        {/* Bulk Delete Button & Info */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowModal(true)}
            disabled={selectedTransactions.length === 0}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium text-xs ${
              selectedTransactions.length === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Trash2 size={14} /> Hapus
          </button>
          {selectedTransactions.length > 0 && (
            <p className="text-gray-300 text-xs">
              Dipilih: {selectedTransactions.length}
            </p>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-800 rounded-xl p-3 shadow-md overflow-x-auto">
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-xs">Belum ada data transaksi.</p>
          ) : (
            <table className="w-full text-left min-w-[600px] text-xs">
              <thead>
                <tr className="bg-gray-700 text-xs">
                  <th className="px-2 py-1">
                    <button onClick={toggleSelectAll}>
                      {selectedTransactions.length === transactions.length ? (
                        <CheckSquare size={14} className="text-indigo-500" />
                      ) : (
                        <Square size={14} className="text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-1">Invoice</th>
                  <th className="px-2 py-1">Items</th>
                  <th className="px-2 py-1">Harga</th>
                  <th className="px-2 py-1">Total</th>
                  <th className="px-2 py-1">Tunai</th>
                  <th className="px-2 py-1">Kembali</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700">
                    <td className="px-2 py-1">
                      <button onClick={() => toggleSelect(transaction.id)}>
                        {selectedTransactions.includes(transaction.id) ? (
                          <CheckSquare size={14} className="text-indigo-500" />
                        ) : (
                          <Square size={14} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-1">{transaction.invoice_number}</td>
                    <td className="px-2 py-1">
                      {transaction.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} (x{item.qty})
                        </div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Konfirmasi */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-5 w-full max-w-sm shadow-xl text-sm">
              <h2 className="text-base font-bold mb-3 text-white">Konfirmasi Hapus</h2>
              <p className="text-gray-300 mb-4">
                Yakin ingin menghapus {selectedTransactions.length} data?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
