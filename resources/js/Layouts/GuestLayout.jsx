import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import Footer from "./GuestComponents/Footer";

export default function GuestLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();

  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/login", label: "Masuk" },
  ];

  const linkClasses = (href) =>
    `px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
      url === href
        ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100 font-sans">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full bg-gray-900/90 border-b border-gray-800/80 shadow-lg backdrop-blur-md transform transition-transform duration-300 z-50 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="text-sm sm:text-base font-bold flex items-center gap-1">
              <span className="font-extrabold italic text-orange-500">di</span>
              <span className="font-extrabold italic text-blue-500">Kasir</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800 transition"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={20} className="text-blue-400" /> : <Menu size={20} className="text-blue-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 space-y-1.5 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`${linkClasses(link.href)} block`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Spacer supaya konten tidak ketutup navbar */}
      <div className="h-14"></div>

      {/* Content */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}