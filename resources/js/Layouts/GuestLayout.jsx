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
    { href: "/", label: "Home" },
    { href: "/guiden", label: "Guide" },
    { href: "/login", label: "Login" },
  ];

  const linkClasses = (href) =>
    `px-2 py-1 rounded transition-colors duration-200 ${
      url === href
        ? "bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold"
        : "hover:bg-gray-700 dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-900"
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
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md transform transition-transform duration-300 z-50 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="text-lg font-bold flex items-center gap-1">
              <span className="font-extrabold italic text-orange-500">di</span>
              <span className="font-extrabold italic text-blue-800">Kasir</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-blue-600 px-4 py-2 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
      <main>{children}</main>
      <Footer />
    </div>
  );
}
