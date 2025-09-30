import React from "react";
import { motion } from "framer-motion";
import { UserCog, User } from "lucide-react";

const Introduction = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-700 via-pink-700 to-blue-700 p-6">
      {/* Copywriting Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 max-w-2xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
          Coba pengalaman baru bersama{" "}
          <span className="bg-white px-2 py-1 rounded">
            <span className="font-extrabold italic text-orange-500">di</span>
            <span className="font-extrabold italic text-blue-800">Kasir</span>
          </span>
        </h1>
        <p className="text-gray-200">
          Aplikasi kasir modern yang memudahkan pengelolaan toko Anda, cepat,
          simpel, dan stylish. Login sebagai <strong>Staff</strong> atau{" "}
          <strong>Admin</strong> untuk mencoba fitur-fiturnya.
        </p>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Staff Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
        >
          <User className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Staff
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Email:</span> staff@gmail.com
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Password:</span> asdfasdf
          </p>
        </motion.div>

        {/* Admin Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
        >
          <UserCog className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Admin
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Email:</span> admin@gmail.com
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Password:</span> asdfasdf
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Introduction;
