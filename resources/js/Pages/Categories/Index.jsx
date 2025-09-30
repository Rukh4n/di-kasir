import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Plus, Edit, Trash2, X, Search, Eye } from "lucide-react"
import { Link, router, usePage } from '@inertiajs/react'

const Index = ({ categories }) => {
  const { flash, auth } = usePage().props
  const user = auth.user

  const [showFlash, setShowFlash] = useState(!!flash.success || !!flash.error)
  const [flashMessage, setFlashMessage] = useState(flash.success || flash.error || '')
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [query, setQuery] = useState('')
  const [filteredCategories, setFilteredCategories] = useState(categories)

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

  const handleDelete = () => {
    if (selectedCategory) {
      router.delete(route('categories.destroy', selectedCategory.id), {
        onFinish: () => closeModal()
      })
    }
  }

  const handleSearch = (e) => setQuery(e.target.value)
  const submitSearch = () => {
    router.get(route('categories.index'), { query }, {
      preserveState: true,
      onSuccess: (page) => {
        setFilteredCategories(page.props.categories || [])
      }
    })
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch()
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-2 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <h1 className="text-xl font-bold">Daftar Kategori</h1>
          <div className="flex flex-col md:flex-row gap-1 items-center md:ml-auto text-sm">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Cari kode atau nama kategori"
              className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-500/50"
            />
            <button
              onClick={submitSearch}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 text-xs"
            >
              <Search className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              Cari
            </button>
            <Link href={route('categories.create')}>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-3 py-1 flex items-center gap-1 shadow transition-all duration-300 text-xs"
              >
                <Plus className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
                Tambah Kategori
              </button>
            </Link>
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

        <div className="bg-gray-800 rounded-xl p-3 md:p-4 shadow overflow-x-auto text-sm">
          {filteredCategories.length === 0 ? (
            <p className="text-gray-400">Belum ada data kategori.</p>
          ) : (
            <table className="w-full text-left min-w-[400px] table-auto text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-2 py-1">Kode</th>
                  <th className="px-2 py-1">Nama</th>
                  <th className="px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr 
                    key={category.id} 
                    className="border-b border-gray-700 cursor-pointer hover:bg-gray-700/50"
                  >
                    <td className="px-2 py-1">{category.code}</td>
                    <td className="px-2 py-1">{category.name}</td>
                    <td className="px-2 py-1 flex gap-1">
                      <Link href={route('categories.show', category.id)}>
                        <Eye className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
                      </Link>
                      <Link href={route('categories.edit', category.id)}>
                        <Edit className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openModal(category)
                        }}
                        className={`p-1 rounded-md transition ${
                          user?.role === 'admin' ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Trash2 className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
            <div className="bg-gray-800 rounded-xl p-4 w-72 md:w-80 shadow relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4 p-0.5 bg-gray-700 rounded-full" />
              </button>
              <h2 className="text-md font-bold mb-2">Konfirmasi Hapus</h2>
              <p className="text-gray-200 mb-4 text-sm">Apakah Anda yakin ingin menghapus kategori ini?</p>
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
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
