import React from "react";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, Music2 } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-r from-orange-700 via-pink-700 to-blue-700 px-6 md:px-20 py-20 flex items-center justify-center">
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Siap Naik Level dengan{" "}
          <span className="bg-white px-2 rounded inline-block">
            <span className="italic font-bold text-orange-600">di</span>
            <span className="italic font-bold text-blue-800">Kasir</span>
          </span>
          ?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Kelola bisnis lebih mudah, modern, dan profesional. Hubungi kami untuk
          berdiskusi lebih lanjut atau ikuti sosial media kami.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/nur_rukhan/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Instagram className="w-6 h-6" />
            Instagram
          </motion.a>

          {/* TikTok */}
          <motion.a
            href="https://www.tiktok.com/@nur_rukhan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-black to-gray-700 hover:opacity-90 px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Music2 className="w-6 h-6" />
            TikTok
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/6285727165906?text=${encodeURIComponent(
              "Saya butuh aplikasi diKasir buat usaha saya. bisa ngga kalu kita diskusi lebih lanjut?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <MessageCircle className="w-6 h-6" />
            WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
