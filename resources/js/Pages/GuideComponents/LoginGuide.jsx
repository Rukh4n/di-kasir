import React from "react";

const LoginGuide = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Copywriting Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Panduan Login Aplikasi Kasir
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Pilih peran Anda sebelum login ke aplikasi. Jika Anda seorang{" "}
          <span className="font-semibold text-blue-600">Staff</span>, gunakan
          panduan login staff. Jika Anda seorang{" "}
          <span className="font-semibold text-green-600">Admin</span>, ikuti
          langkah login admin. Ikuti panduan berikut agar proses login lebih
          mudah dan cepat.
        </p>
      </div>

      {/* Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Staff Guide */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Panduan Login Staff
          </h2>
          <img
            src="/guide/staff_login.png"
            alt="Panduan Login Staff"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Gunakan akun <span className="font-semibold">Staff</span> untuk
            mengelola transaksi harian di toko Anda dengan mudah.
          </p>
        </div>

        {/* Admin Guide */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Panduan Login Admin
          </h2>
          <img
            src="/guide/admin_login.png"
            alt="Panduan Login Admin"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Gunakan akun <span className="font-semibold">Admin</span> untuk
            memantau laporan produk dan transaksi serta mendapatkan fitur yang lebih advanced.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginGuide;
