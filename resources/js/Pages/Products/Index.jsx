import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, usePage } from '@inertiajs/react'

import HeaderActions from './HeaderActions'
import SearchFilterBar from './SearchFilterBar'
import FlashAlert from './FlashAlert'
import ProductTable from './ProductTable'
import DeleteModal from './DeleteModal'

const Index = ({ products, branches = [], filters = {} }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [flashType, setFlashType] = useState(flash.success ? 'success' : flash.error ? 'error' : 'warning')
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [query, setQuery] = useState(filters.query || '')
  const [selectedBranch, setSelectedBranch] = useState(filters.branch_id || '')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(products.data || [])

  useEffect(() => {
    setFilteredProducts(products.data || [])
  }, [products])

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

  const handleFilter = () => {
    router.get(
      route('products.index'),
      { query, branch_id: selectedBranch, startDate, endDate },
      { preserveState: true }
    )
  }

  const submitSearch = (page = 1) => {
    router.get(
      route('products.index'),
      { query, branch_id: selectedBranch, startDate, endDate, page },
      {
        preserveState: true,
        onSuccess: (pageData) => setFilteredProducts(pageData.props.products.data || [])
      }
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch()
    }
  }

  const exportUrl = route('products.export', { query, branch_id: selectedBranch, startDate, endDate })

  // Pembatasan akses export untuk staff telah dihapus agar staff dapat melakukan export data produk

  return (
    <AuthenticatedLayout>
      <Head title="Daftar Produk">
        <meta name="description" content="Kelola dan pantau data produk secara keseluruhan maupun berdasarkan cabang toko Anda." />
      </Head>

      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeaderActions
            user={user}
            exportUrl={exportUrl}
          />

          <SearchFilterBar
            query={query}
            setQuery={setQuery}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            branches={branches}
            user={user}
            onFilter={handleFilter}
            onSearch={submitSearch}
            onKeyDown={handleKeyDown}
          />

          <FlashAlert
            show={showFlash}
            message={flashMessage}
            type={flashType}
          />

          <ProductTable
            products={products}
            filteredProducts={filteredProducts}
            user={user}
            openDeleteModal={openDeleteModal}
          />

          <DeleteModal
            show={showModal}
            deleteMode={deleteMode}
            onClose={closeModal}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
