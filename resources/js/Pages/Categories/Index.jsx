import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage } from '@inertiajs/react'
import CategoryHeader from './CategoryHeader'
import CategoryFlashMessage from './CategoryFlashMessage'
import CategoryCardGrid from './CategoryCardGrid'
import CategoryDeleteModal from './CategoryDeleteModal'

const Index = ({ categories, branches = [], filters = {} }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [query, setQuery] = useState(filters.query || '')
  const [branchId, setBranchId] = useState(filters.branch_id || '')
  const [filteredCategories, setFilteredCategories] = useState(categories)

  useEffect(() => {
    setFilteredCategories(categories)
  }, [categories])

  useEffect(() => {
    if (flash.success || flash.error) {
      setFlashMessage(flash.success || flash.error)
      setShowFlash(true)
      const timer = setTimeout(() => setShowFlash(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [flash])

  const openModal = (category) => {
    if (user?.role !== "admin") {
      setFlashMessage("Kamu bukan Admin utama atau Pemilik Toko")
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 3000)
      return
    }
    setSelectedCategory(category)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedCategory(null)
    setShowModal(false)
  }

  return (
    <AuthenticatedLayout>
    <Head title="KategoriProduk">
      <meta name="description" content="Pantau semua kategori yang Anda miliki dalam satu dashboard ini.." />
    </Head>
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
        <CategoryHeader 
          query={query} 
          setQuery={setQuery} 
          branchId={branchId}
          setBranchId={setBranchId}
          branches={branches}
          userRole={user?.role}
          setFilteredCategories={setFilteredCategories} 
        />

        <CategoryFlashMessage 
          showFlash={showFlash} 
          flash={flash} 
          flashMessage={flashMessage} 
        />

        <CategoryCardGrid 
          filteredCategories={filteredCategories} 
          openModal={openModal} 
          userRole={user?.role} 
        />

        <CategoryDeleteModal 
          showModal={showModal} 
          closeModal={closeModal} 
          selectedCategory={selectedCategory} 
        />
      </div>
    </AuthenticatedLayout>
  )
}

export default Index