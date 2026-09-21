import React from "react";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-blue-950 border-t border-blue-900/50 text-gray-300 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
        {/* Brand & Description */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-white">
            <span className="bg-white px-2 py-0.5 rounded shadow-sm">
              <span className="italic font-bold text-orange-600">di</span>
              <span className="italic font-bold text-blue-600">Kasir</span>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md">
            Solusi kasir modern untuk pengelolaan multi cabang. Mudahkan operasional usaha Anda secara terpusat, cepat, dan profesional.
          </p>
          <div className="flex gap-3 pt-1">
            <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95 transition shadow-md">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-500 transition shadow-md">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-sky-500 text-white hover:bg-sky-400 transition shadow-md">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-500 transition shadow-md">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-3 md:text-right">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Kontak Kami</h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <a href="https://wa.me/6281959322735" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-300 transition md:justify-end">
                <span>+62 819 5932 2735</span>
                <Phone className="w-4 h-4 text-blue-400" />
              </a>
            </li>
            <li>
              <a href="mailto:officialdisoftwa@gmail.com" className="inline-flex items-center gap-2 hover:text-blue-300 transition md:justify-end">
                <span>officialdisoftwa@gmail.com</span>
                <Mail className="w-4 h-4 text-blue-400" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto border-t border-blue-900/80 mt-8 pt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} diKasir. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;