import React from "react";

const PageCategories = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Copywriting Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tampilan Dashboard Kategori
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gambar di bawah menunjukkan dashboard kategori sesuai peran.{" "}
          <span className="font-semibold text-blue-600">Staff</span> melihat
          kategori yang mereka kelola, sedangkan{" "}
          <span className="font-semibold text-green-600">Admin</span> memiliki
          akses penuh untuk mengatur semua kategori.
        </p>
      </div>

      {/* Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Staff Category */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Kategori Staff
          </h2>
          <img
            src="/guide/staff_cateory.png"
            alt="Kategori Staff"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Tampilan kategori untuk <span className="font-semibold">Staff</span> 
            memudahkan pengelolaan produk yang mereka tangani.
          </p>
        </div>

        {/* Admin Category */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Kategori Admin
          </h2>
          <img
            src="/guide/admin_category.png"
            alt="Kategori Admin"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Tampilan kategori untuk <span className="font-semibold">Admin</span> 
            memberikan kontrol penuh atas semua kategori dalam sistem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageCategories;
