import { useState } from 'react';
import NavBar from './Components/NavBar';

export default function AuthenticatedLayout({ header, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden sm:flex flex-col w-64">
        <NavBar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 h-full bg-blue-800 text-gray-100 shadow-xl">
            <NavBar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top nav for mobile */}
        <nav className="sm:hidden border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 flex justify-between items-center px-4 h-16">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <header className="bg-white shadow dark:bg-gray-800">
            <div className="px-4 py-6 sm:px-6 lg:px-8">{header}</div>
          </header>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
