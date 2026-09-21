import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { ShoppingBag, DollarSign, Receipt, AlertCircle, ShoppingCart, History, Clock, CreditCard, Wallet } from 'lucide-react';

const CasierDashboard = ({
    shiftInfo = {},
    stats = {},
    recentTransactions: initialTransactions = [],
    localLowStock: initialLowStock = [],
}) => {
    const [recentTransactions, setRecentTransactions] = useState(initialTransactions);
    const [localLowStock, setLocalLowStock] = useState(initialLowStock);

    useEffect(() => {
        setRecentTransactions(initialTransactions);
        setLocalLowStock(initialLowStock);
    }, [initialTransactions, initialLowStock]);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await fetch('/dashboard/monitoring', {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setRecentTransactions(data.recentTransactions || []);
                        setLocalLowStock(data.localLowStock || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching real-time cashier monitoring updates:', error);
            }
        };

        const interval = setInterval(fetchUpdates, 20000); // Fetch setiap 10 detik
        return () => clearInterval(interval);
    }, []);

    const handleOpenPos = () => {
        router.get(route('transactions.create'));
    };

    const handleViewHistory = () => {
        router.get(route('transactions.index'));
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header & Informasi Shift */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                            Shift Aktif
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mt-2 tracking-tight">
                        Selamat Bertugas, {shiftInfo.cashier_name || 'Kasir'}!
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                        <span>{shiftInfo.branch_name || 'Cabang -'}</span> 
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleOpenPos}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Buka POS / Kasir
                    </button>
                    <button 
                        onClick={handleViewHistory}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold px-4 py-3 rounded-xl shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
                    >
                        <History className="w-5 h-5 text-white" />
                        Riwayat
                    </button>
                </div>
            </div>

            {/* Metric Cards Hari Ini */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Omset Hari Ini</p>
                            <h4 className="text-2xl font-bold text-slate-100 mt-1 font-mono">
                                Rp {(stats.today_revenue ?? 0).toLocaleString('id-ID')}
                            </h4>
                        </div>
                        <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-lg">
                            <DollarSign className="w-7 h-7 text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Transaksi Hari Ini</p>
                            <h4 className="text-2xl font-bold text-slate-100 mt-1 font-mono">
                                {(stats.today_transactions ?? 0).toLocaleString('id-ID')}{' '}
                                <span className="text-sm font-normal text-slate-400 font-sans">Struk</span>
                            </h4>
                        </div>
                        <div className="p-3 bg-blue-950/60 border border-blue-800/40 rounded-lg">
                            <Receipt className="w-7 h-7 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Produk Ready</p>
                            <h4 className="text-2xl font-bold text-slate-100 mt-1 font-mono">
                                {(stats.available_products ?? 0).toLocaleString('id-ID')}{' '}
                                <span className="text-sm font-normal text-slate-400 font-sans">Item</span>
                            </h4>
                        </div>
                        <div className="p-3 bg-purple-950/60 border border-purple-800/40 rounded-lg">
                            <ShoppingBag className="w-7 h-7 text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaksi Sesi Ini & Stok Lokal Cabang */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-bold text-slate-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Transaksi Terakhir (Cabang Ini)
                        </h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">ID Transaksi</th>
                                    <th className="px-4 py-3 text-center">Jam</th>
                                    <th className="px-4 py-3 text-center">Jumlah Item</th>
                                    <th className="px-4 py-3 text-center">Metode</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((trx, index) => (
                                        <tr key={trx.id ?? index} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-4 py-3 font-bold font-mono text-blue-400">
                                                {trx.id}
                                            </td>
                                            <td className="px-4 py-3 text-center text-slate-400">{trx.time}</td>
                                            <td className="px-4 py-3 text-center">{trx.items_count} item</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                                                    {(trx.method === 'QRIS' || trx.method === 'Debit' || trx.method === 'Kredit') && (
                                                        <CreditCard className={`w-3 h-3 ${trx.method === 'QRIS' ? 'text-purple-400' : 'text-blue-400'}`} />
                                                    )}
                                                    {trx.method === 'Tunai' && <Wallet className="w-3 h-3 text-emerald-400" />}
                                                    {trx.method}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-emerald-400 font-mono">
                                                Rp {Number(trx.total ?? 0).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                                            Belum ada transaksi pada shift ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-md font-bold text-slate-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Stok Cabang Kritis
                        </h4>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">
                        Segera laporkan ke admin jika persediaan bahan dasar ini habis.
                    </p>
                    <div className="space-y-3">
                        {localLowStock.length > 0 ? (
                            localLowStock.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-amber-200">{item.name}</p>
                                        <p className="text-xs text-slate-400">Satuan: {item.unit || 'pcs'}</p>
                                    </div>
                                    <span className="px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-900/60 border border-amber-700/50 rounded-full font-mono">
                                        Sisa {item.stock}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center py-6 text-slate-500">
                                Stok Masih Aman!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CasierDashboard;
