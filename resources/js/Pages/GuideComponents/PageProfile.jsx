import React from "react";

const PageProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Copywriting Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Tampilan Dashboard Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gambar di bawah menunjukkan dashboard profil sesuai peran.{" "}
          <span className="font-semibold text-blue-600">Staff</span> dapat melihat dan mengelola profil pribadi, sedangkan{" "}
          <span className="font-semibold text-green-600">Admin</span> dapat mengelola profil seluruh pengguna.
        </p>
      </div>

      {/* Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Staff Profile */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Profil Staff
          </h2>
          <img
            src="/guide/staff_profile.png"
            alt="Profil Staff"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Tampilan profil untuk <span className="font-semibold">Staff</span>{" "}
            memungkinkan pengelolaan informasi pribadi secara mudah.
          </p>
        </div>

        {/* Admin Profile */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Profil Admin
          </h2>
          <img
            src="/guide/admin_profile.png"
            alt="Profil Admin"
            className="rounded-xl shadow-md w-full object-contain"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm text-center">
            Tampilan profil untuk <span className="font-semibold">Admin</span>{" "}
            memberikan kendali penuh untuk mengelola profil semua pengguna.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageProfile;
