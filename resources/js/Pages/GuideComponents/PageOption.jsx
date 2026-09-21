import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { router } from '@inertiajs/react'
import { 
  Trash2, 
  Layers, 
  Package, 
  Store, 
  Receipt, 
  AlertTriangle, 
  X, 
  ShieldAlert,
  Calendar,
  Filter
} from 'lucide-react'

export default function Index() {
  const [showModal, setShowModal] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterMode, setFilterMode] = useState('all')
  const [selectedPreset, setSelectedPreset] = useState('')

  const menuItems = [
    {
      id: 'categories',
      title: 'Hapus Data Kategori',
      description: 'Menghapus seluruh data kategori produk yang tersimpan dalam sistem.',
      icon: <Layers className="w-6 h-6 text-blue-400" />,
      borderHover: 'hover:border-blue-500/50',
      bgIcon: 'bg-blue-950/40 border-blue-800/50',
      btnColor: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
    },
    {
      id: 'products',
      title: 'Hapus Data Produk',
      description: 'Menghapus seluruh inventaris produk dan informasi terkait.',
      icon: <Package className="w-6 h-6 text-blue-400" />,
      borderHover: 'hover:border-blue-500/50',
      bgIcon: 'bg-blue-950/40 border-blue-800/50',
      btnColor: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
    },
    {
      id: 'branches',
      title: 'Hapus Data Cabang',
      description: 'Menghapus seluruh data cabang toko yang terdaftar.',
      icon: <Store className="w-6 h-6 text-blue-400" />,
      borderHover: 'hover:border-blue-500/50',
      bgIcon: 'bg-blue-950/40 border-blue-800/50',
      btnColor: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
    },
    {
      id: 'transactions',
      title: 'Hapus Data Transaksi',
      description: 'Menghapus seluruh riwayat dan catatan transaksi penjualan.',
      icon: <Receipt className="w-6 h-6 text-blue-400" />,
      borderHover: 'hover:border-blue-500/50',
      bgIcon: 'bg-blue-950/40 border-blue-800/50',
      btnColor: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
    }
  ]

  const handleOpenModal = (item) => {
    setSelectedTarget(item)
    setStartDate('')
    setEndDate('')
    setFilterMode('all')
    setSelectedPreset('')
    setShowModal(true)
  }

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset)
    const today = new Date()
    let start = new Date()
    let end = new Date()

    if (preset === 'today') {
      start = today
      end = today
    } else if (preset === 'this_month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    } else if (preset === 'last_month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      end = new Date(today.getFullYear(), today.getMonth(), 0)
    } else if (preset === 'this_year') {
      start = new Date(today.getFullYear(), 0, 1)
      end = new Date(today.getFullYear(), 11, 31)
    } else {
      setStartDate('')
      setEndDate('')
      return
    }

    const formatDate = (d) => d.toISOString().split('T')[0]
    setStartDate(formatDate(start))
    setEndDate(formatDate(end))
  }

  const handleConfirmDelete = () => {
    if (!selectedTarget) return
    
    router.post(route('options.destroyAll', { type: selectedTarget.id }), {
      start_date: startDate,
      end_date: endDate,
    }, {
      onSuccess: () => {
        setShowModal(false)
        setSelectedTarget(null)
      }
    })
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 text-xs font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
              Pusat Pembersihan Data
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Pilih jenis data yang ingin dibersihkan atau dihapus secara menyeluruh dari sistem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div 
                key={item.id}
                className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between ${item.borderHover}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${item.bgIcon}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">{item.title}</h2>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs text-white shadow-md transition-all active:scale-95 ${item.btnColor}`}
                  >
                    <Trash2 size={14} />
                    <span>Hapus Data</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {showModal && selectedTarget && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-lg shadow-2xl relative text-xs animate-in fade-in zoom-in duration-150">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Konfirmasi Penghapusan</h2>
                  <p className="text-slate-400 text-[11px] mt-0.5">Tindakan ini bersifat permanen.</p>
                </div>
              </div>

              <p className="text-slate-300 mb-4 bg-slate-800/50 border border-slate-800 p-3 rounded-lg leading-relaxed">
                Apakah Anda benar-benar yakin ingin menghapus <span className="font-semibold text-blue-400">{selectedTarget.title}</span>? Terapkan filter periodik di bawah untuk menghapus data berdasarkan rentang waktu tertentu atau kosongkan untuk menghapus semua data.
              </p>

              <div className="space-y-3 mb-4 bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Filter size={14} className="text-blue-400" />
                    <span>Metode Pembersihan Periodik</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setFilterMode('all'); setStartDate(''); setEndDate(''); setSelectedPreset(''); }}
                    className={`py-1.5 px-2 rounded-lg font-medium border transition-all text-center ${
                      filterMode === 'all' 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Semua Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('preset')}
                    className={`py-1.5 px-2 rounded-lg font-medium border transition-all text-center ${
                      filterMode === 'preset' 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Preset Periode
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterMode('range'); setSelectedPreset(''); }}
                    className={`py-1.5 px-2 rounded-lg font-medium border transition-all text-center ${
                      filterMode === 'range' 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Kustom Rentang
                  </button>
                </div>

                {filterMode === 'preset' && (
                  <div className="mb-3">
                    <label className="block text-[11px] text-slate-400 mb-1">Pilih Periode Cepat</label>
                    <select
                      value={selectedPreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Pilih Preset Periode --</option>
                      <option value="today">Hari Ini</option>
                      <option value="this_month">Bulan Ini</option>
                      <option value="last_month">Bulan Lalu</option>
                      <option value="this_year">Tahun Ini</option>
                    </select>
                  </div>
                )}

                {(filterMode === 'range' || filterMode === 'preset') && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Dari Tanggal</label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Sampai Tanggal</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/30"
                >
                  <Trash2 size={13} />
                  <span>Ya, Hapus Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}