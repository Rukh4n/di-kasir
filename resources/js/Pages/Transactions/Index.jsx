import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import TransactionHeader from './TransactionHeader';
import TransactionFlashMessage from './TransactionFlashMessage';
import TransactionFilter from './TransactionFilter';
import TransactionCardGrid from './TransactionCardGrid';
import TransactionDeleteModal from './TransactionDeleteModal';
import TransactionDetailModal from './TransactionDetailModal';

const Index = ({ transactions, filters, branches = [] }) => {
  const { flash, auth } = usePage().props;
  const user = auth.user;

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error);
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  const [query, setQuery] = useState(filters?.query || '');
  const [startDate, setStartDate] = useState(filters?.startDate || '');
  const [endDate, setEndDate] = useState(filters?.endDate || '');
  const [branchId, setBranchId] = useState(filters?.branch_id || '');

  useEffect(() => {
    if (flash.success || flash.error) {
      setFlashMessage(flash.success || flash.error);
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const openDeleteModal = (transaction) => {
    if (user?.role !== 'admin') {
      setFlashMessage("Kamu bukan admin utama atau pemilik toko");
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 3000);
      return;
    }
    setSelectedTransaction(transaction);
    setDeleteMode(true);
    setShowModal(true);
  };

  const openPrintModal = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteMode(false);
    setShowDetail(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setShowModal(false);
    setShowDetail(false);
  };

  const handleDelete = () => {
    if (selectedTransaction) {
      router.delete(route('transactions.destroy', selectedTransaction.id), {
        onFinish: () => closeModal()
      });
    }
  };

  const handleFilter = () => router.get(route('transactions.index'), { query, startDate, endDate, branch_id: branchId }, { preserveState: true });

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Transaksi">
        <meta name="description" content="Kelola dan pantau data transaksi secara keseluruhan maupun berdasarkan cabang toko Anda." />
      </Head>
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-6 font-sans">
        <TransactionHeader />
        
        <TransactionFlashMessage 
          showFlash={showFlash} 
          flash={flash} 
          flashMessage={flashMessage} 
          setShowFlash={setShowFlash} 
        />

        <TransactionFilter 
          query={query}
          setQuery={setQuery}
          branchId={branchId}
          setBranchId={setBranchId}
          branches={branches}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleFilter={handleFilter}
          user={user}
        />

        <TransactionCardGrid 
          transactions={transactions}
          user={user}
          openPrintModal={openPrintModal}
          openDeleteModal={openDeleteModal}
        />

        <TransactionDeleteModal 
          showModal={showModal}
          selectedTransaction={selectedTransaction}
          deleteMode={deleteMode}
          closeModal={closeModal}
          handleDelete={handleDelete}
        />

        <TransactionDetailModal 
          showDetail={showDetail}
          selectedTransaction={selectedTransaction}
          closeModal={closeModal}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;