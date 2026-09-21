import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Building2, Users, FolderTree, Package, Receipt, ArrowLeft, Filter, Calendar } from 'lucide-react';
import BranchHeaderInfo from './BranchHeaderInfo';
import BranchSummaryCards from './BranchSummaryCards';
import LowStockAlertTable from './LowStockAlertTable';
import BranchTabSummary from './BranchTabSummary';
import BranchTabUsers from './BranchTabUsers';
import BranchTabProducts from './BranchTabProducts';
import BranchTabCategories from './BranchTabCategories';
import BranchTabTransactions from './BranchTabTransactions';

const Detail = ({ auth, branch, summary, lowStockProducts = [], filters = {} }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [startDate, setStartDate] = useState(filters?.start_date || '');
  const [endDate, setEndDate] = useState(filters?.end_date || '');

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);

  const formatDate = (dateString) => !dateString ? '-' : new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleFilter = (e) => {
    e.preventDefault();
    router.get(route('branches.show', branch.id), { start_date: startDate, end_date: endDate }, { preserveState: true, replace: true });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    router.get(route('branches.show', branch.id), {}, { preserveState: true, replace: true });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={route('branches.index')} className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white leading-tight">{branch.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${branch.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {branch.is_active ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>
              <p className="text-xs text-gray-400">Kode Cabang: <span className="font-mono text-gray-200">{branch.code}</span></p>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`Detail Cabang - ${branch.name}`} />

      <div className="space-y-6">
        <BranchHeaderInfo branch={branch} />

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="w-full sm:w-auto">
              <label className="block text-xs text-gray-400 mb-1">Dari Tanggal</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs text-gray-400 mb-1">Sampai Tanggal</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="submit" className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
              {(startDate || endDate) && (
                <button type="button" onClick={handleReset} className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs font-medium transition-colors">
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        <BranchSummaryCards summary={summary} formatRupiah={formatRupiah} />
        <LowStockAlertTable lowStockProducts={lowStockProducts} formatRupiah={formatRupiah} />

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            <button onClick={() => setActiveTab('summary')} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'summary' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}>
              <Building2 className="w-4 h-4" /> Ringkasan Data Cabang
            </button>
            <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}>
              <Users className="w-4 h-4" /> Pengguna / Staff ({branch.users_count || 0})
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'products' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}>
              <Package className="w-4 h-4" /> Produk ({branch.products_count || 0})
            </button>
            <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'categories' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}>
              <FolderTree className="w-4 h-4" /> Kategori ({branch.categories_count || 0})
            </button>
            <button onClick={() => setActiveTab('transactions')} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'transactions' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}>
              <Receipt className="w-4 h-4" /> Transaksi Terbaru ({branch.transactions_count || 0})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && <BranchTabSummary branch={branch} />}
            {activeTab === 'users' && <BranchTabUsers users={branch.users} formatDate={formatDate} />}
            {activeTab === 'products' && <BranchTabProducts products={branch.products} formatRupiah={formatRupiah} />}
            {activeTab === 'categories' && <BranchTabCategories categories={branch.categories} />}
            {activeTab === 'transactions' && <BranchTabTransactions transactions={branch.transactions} formatDate={formatDate} formatRupiah={formatRupiah} />}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Detail;
