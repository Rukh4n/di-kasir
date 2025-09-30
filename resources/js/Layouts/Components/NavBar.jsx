import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Home, Layers, Package, ShoppingCart, Settings, User, LogOut } from 'lucide-react';

const NavBar = () => {
  const { auth } = usePage().props;

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5 mr-3" /> },
    { name: 'Kategori', href: '/categories', icon: <Layers className="w-5 h-5 mr-3" /> },
    { name: 'Produk', href: '/product-list', icon: <Package className="w-5 h-5 mr-3" /> },
    { name: 'Transaksi', href: '/transaction-list', icon: <ShoppingCart className="w-5 h-5 mr-3" /> },
  ];

  if (auth.user && auth.user.role === 'admin') {
    links.push({ name: 'Options', href: '/options', icon: <Settings className="w-5 h-5 mr-3" /> });
  }

  const currentPath = window.location.pathname;
  const isActive = (href) => currentPath.startsWith(href);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <aside className="w-64 h-screen fixed bg-blue-800 text-gray-100 flex flex-col shadow-xl">
      <div className="px-6 py-5 text-2xl font-bold border-b border-blue-700 flex items-center justify-center italic">
        <span className="text-orange-500 font-extrabold">di</span>
        <span className="text-blue-600 font-extrabold ml-1">Kasir</span>
      </div>

      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-2 mt-0">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive(link.href)
                ? 'bg-blue-500 text-white font-medium'
                : 'text-gray-200 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {link.icon}
            <span className="ml-2">{link.name}</span>
          </a>
        ))}

        <div className="mt-6 border-t border-blue-700 pt-4 space-y-2">
          <a
            href="/profile"
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive('/profile')
                ? 'bg-blue-500 text-white font-medium'
                : 'text-gray-200 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default NavBar;
