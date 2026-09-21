import { useState } from 'react';
import NavBar from './Components/NavBar';
import Footer from "./GuestComponents/Footer";

export default function AuthenticatedLayout({ header, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar for desktop */}
      <div className="hidden sm:flex flex-col w-64 shrink-0">
        <NavBar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 h-full bg-blue-950 text-gray-100 shadow-xl z-50">
            <NavBar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top nav for mobile */}
        <nav className="sm:hidden border-b border-gray-800 bg-gray-900 flex justify-between items-center px-4 h-16 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {header && (
          <header className="bg-gray-900 border-b border-gray-800 shadow-sm">
            <div className="px-4 py-6 sm:px-6 lg:px-8 text-white font-bold text-base sm:text-lg">{header}</div>
          </header>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
        
        <Footer />
      </div>
    </div>
  );
}