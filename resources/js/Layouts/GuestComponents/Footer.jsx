import React from "react";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 text-gray-200 flex items-center justify-center px-6 md:px-20 py-16">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            <span className="bg-white px-2 rounded">
              <span className="italic font-bold text-orange-600">di</span>
              <span className="italic font-bold text-blue-800">Kasir</span>
            </span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Solusi kasir modern untuk UMKM Indonesia. Mudahkan pengelolaan usaha
            Anda dengan teknologi yang cepat, efisien, dan profesional.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500 hover:bg-sky-600 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Navigasi</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                Fitur
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-400 transition">
                Kontak
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Kontak Kami</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-orange-400" />
              <span>+62 857 2716 5906</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-400" />
              <span>support@dikasir.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span>Kebumen, Jawa Tengah, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 w-full border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} diKasir. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
