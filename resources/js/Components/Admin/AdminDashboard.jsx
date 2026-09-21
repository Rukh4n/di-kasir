import React, { useState, useEffect } from 'react';
import { Store, ShoppingCart, DollarSign, Package, AlertTriangle, TrendingUp, Clock, UserCheck } from 'lucide-react';

const formatTimeAgo = (timeString) => {
    if (!timeString) return '';
    return timeString
        .replace(/years? ago/i, 'tahun yang lalu')
        .replace(/months? ago/i, 'bulan yang lalu')
        .replace(/weeks? ago/i, 'minggu yang lalu')
        .replace(/days? ago/i, 'hari yang lalu')
        .replace(/hours? ago|h ago/i, 'jam yang lalu')
        .replace(/minutes? ago|m ago/i, 'menit yang lalu')
        .replace(/seconds? ago|s ago/i, 'detik yang lalu')
        .replace(/just now/i, 'baru saja');
};

const AdminDashboard = ({
    stats = {},
    branchPerformances = [],
    lowStockProducts: initialLowStock = [],
    recentTransactions: initialTransactions = [],
    filters = {},
}) => {
    const [recentTransactions, setRecentTransactions] = useState(initialTransactions);
    const [lowStockProducts, setLowStockProducts] = useState(initialLowStock);

    useEffect(() => {
        setRecentTransactions(initialTransactions);
        setLowStockProducts(initialLowStock);
    }, [initialTransactions, initialLowStock]);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const queryParams = new URLSearchParams(filters).toString();
                const response = await fetch(`/dashboard/monitoring?${queryParams}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setRecentTransactions(data.recentTransactions || []);
                        setLowStockProducts(data.lowStockProducts || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching real-time monitoring updates:', error);
            }
        };

        const interval = setInterval(fetchUpdates, 20000); // Fetch setiap 10 detik
        return () => clearInterval(interval);
    }, [filters]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Ringkasan Eksekutif (Seluruh Cabang) Pada Bulan Ini
                </h3>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Cabang</p>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                {(stats?.total_branches ?? 0).toLocaleString('id-ID')}
                            </h4>
                        </div>
                        <Store className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                {(stats?.total_transactions ?? 0).toLocaleString('id-ID')}
                            </h4>
                        </div>
                        <ShoppingCart className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pendapatan</p>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                Rp {(stats?.total_revenue ?? 0).toLocaleString('id-ID')}
                            </h4>
                        </div>
                        <DollarSign className="w-8 h-8 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Katalog Produk</p>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                                {(stats?.total_products ?? 0).toLocaleString('id-ID')}
                            </h4>
                        </div>
                        <Package className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Performa Per Cabang & Stok Menipis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Performa Per Cabang
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Nama Cabang</th>
                                    <th className="px-4 py-3 text-center">Transaksi</th>
                                    <th className="px-4 py-3 text-right">Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {branchPerformances.length > 0 ? (
                                    branchPerformances.map((branch, index) => (
                                        <tr key={branch.id ?? index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                {branch.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {(branch.transactions_count ?? 0).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                                                Rp {Number(branch.revenue ?? 0).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-6 text-center text-gray-400">
                                            Belum ada data performa cabang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Stok Menipis
                    </h4>
                    <div className="space-y-3">
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cabang: {product.branch_name}</p>
                                    </div>
                                    <span className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-200 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                                        Sisa {product.stock}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center py-6 text-gray-400">
                                Semua stok produk masih aman.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Transaksi Terbaru */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="text-md font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-green-500" />
                    Aktivitas Transaksi Terbaru
                </h4>
                {recentTransactions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentTransactions.map((trx, index) => (
                            <div key={trx.id ?? index} className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-100 dark:border-gray-700 space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{trx.id}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{trx.branch}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                        <UserCheck className="w-3 h-3" /> {trx.cashier}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                                    <p className="text-base font-bold text-gray-900 dark:text-white">
                                        Rp {Number(trx.amount ?? 0).toLocaleString('id-ID')}
                                    </p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeAgo(trx.time)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-center py-6 text-gray-400">
                        Belum ada aktivitas transaksi terbaru.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
