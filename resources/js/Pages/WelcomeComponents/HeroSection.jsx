import React from "react";
import { ShoppingCart, BarChart2, Users } from "lucide-react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 dark:bg-gray-900 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-12">
      {/* Hero Left: Text & CTA */}
      <motion.div
        className="flex-1 text-center md:text-left mb-12 md:mb-0 space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo / Brand */}
        <motion.div
          className="flex items-center justify-center md:justify-start gap-3 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ShoppingCart className="w-12 h-12 text-white" />
          <h1 className="text-3xl sm:text-4xl font-extrabold italic tracking-wide">
            <span className="text-orange-400">di</span>
            <span className="text-blue-800">Kasir</span>
          </h1>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl sm:text-5xl font-extrabold text-white leading-snug"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Solusi Kasir Modern <br /> untuk Bisnis Anda
        </motion.h2>

        <motion.p
          className="text-white/90 text-lg sm:text-xl max-w-lg mx-auto md:mx-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Kelola transaksi lebih cepat, hemat waktu, dan tingkatkan produktivitas
          bisnis dengan sistem kasir yang sederhana dan powerful.
        </motion.p>

        {/* Features Icons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-xl shadow-md hover:bg-white/20 transition">
            <BarChart2 className="w-6 h-6" />
            <span>Analitik Real-Time</span>
          </div>
          
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-xl shadow-md hover:bg-white/20 transition">
            <Users className="w-6 h-6" />
            <span>Multi-User & Cloud</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            Mulai Sekarang
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-white text-white font-bold rounded-full hover:bg-white/20 transition"
          >
            Pelajari Lebih Lanjut
          </Link>
        </motion.div>
      </motion.div>

      {/* Hero Right: Screenshot / Illustration */}
      <motion.div
        className="flex-1 flex justify-center h-screen"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <img
          src="/welcome/tallent.png"
          alt="Screenshot Aplikasi diKasir"
          className="h-full object-contain rounded-3xl shadow-2xl border-4 border-white/20"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
