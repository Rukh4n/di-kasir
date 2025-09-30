import React from "react";

const PageOption = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Copywriting Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tampilan Dashboard Opsi
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Kolom di bawah menunjukkan dashboard opsi sesuai peran.{" "}
          <span className="font-semibold text-blue-600">Staff</span> tidak memiliki opsi tambahan, sedangkan{" "}
          <span className="font-semibold text-green-600">Admin</span> dapat mengakses opsi pengaturan penuh.
        </p>
      </div>

      {/* Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Staff Option */}
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-64">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Opsi Staff
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center mt-auto mb-auto">
            Tidak Ada Opsi
          </p>
        </div>

        {/* Admin Option */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Opsi Admin
          </h2>
          <img
            src="/guide/admin_option.png"
            alt="Opsi Admin"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Tampilan opsi untuk <span className="font-semibold">Admin</span>{" "}
            memberikan kontrol penuh atas pengaturan dan konfigurasi sistem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageOption;
