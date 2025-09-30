import React from "react";

const PanelDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Copywriting Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tampilan Dashboard Aplikasi Kasir
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Setelah login, Anda akan diarahkan ke dashboard sesuai peran.{" "}
          <span className="font-semibold text-blue-600">Staff</span> fokus pada
          transaksi harian, sedangkan{" "}
          <span className="font-semibold text-green-600">Admin</span> memiliki
          akses penuh untuk mengelola sistem.
        </p>
      </div>

      {/* Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Staff Dashboard */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Dashboard Staff
          </h2>
          <img
            src="/guide/staff_dashboard.png"
            alt="Dashboard Staff"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Dashboard <span className="font-semibold">Staff</span> dirancang
            untuk memudahkan transaksi cepat, pencatatan penjualan, dan
            pelayanan pelanggan.
          </p>
        </div>

        {/* Admin Dashboard */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Dashboard Admin
          </h2>
          <img
            src="/guide/admin_dashboard.png"
            alt="Dashboard Admin"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Dashboard <span className="font-semibold">Admin</span> memberikan
            kendali penuh atas laporan, manajemen produk, dan pengaturan akun
            staff.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanelDashboard;
