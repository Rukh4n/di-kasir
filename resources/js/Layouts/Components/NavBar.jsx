import { usePage, router, Link } from '@inertiajs/react';
import { Home, Layers, Package, ShoppingCart, Settings, Users, Store, User, LogOut } from 'lucide-react';

const NavBar = () => {
  const { auth } = usePage().props;
  const currentPath = usePage().url || window.location.pathname;

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-4 h-4 mr-2.5" /> },
    { name: 'Kategori', href: '/categories', icon: <Layers className="w-4 h-4 mr-2.5" /> },
    { name: 'Produk', href: '/product-list', icon: <Package className="w-4 h-4 mr-2.5" /> },
    { name: 'Transaksi', href: '/transaction-list', icon: <ShoppingCart className="w-4 h-4 mr-2.5" /> },
  ];

  if (auth?.user && auth.user.role === 'admin') {
    links.push(
      { name: 'Pengguna', href: '/users', icon: <Users className="w-4 h-4 mr-2.5" /> },
      { name: 'Cabang', href: '/branches', icon: <Store className="w-4 h-4 mr-2.5" /> },
      { name: 'Pembersihan Data', href: '/options', icon: <Settings className="w-4 h-4 mr-2.5" /> }
    );
  }

  const isActive = (href) => {
    if (!href) return false;
    return currentPath === href || currentPath.startsWith(href + '/') || currentPath.startsWith(href + '?');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <aside className="w-56 h-screen fixed bg-blue-800 text-gray-100 flex flex-col shadow-xl">
      <div className="px-5 py-4 text-xl font-bold border-b border-blue-700 flex items-center justify-center italic">
        <span className="text-orange-500 font-extrabold">di</span>
        <span className="text-blue-600 font-extrabold ml-1">Kasir</span>
      </div>

      <nav className="flex-1 px-2.5 py-4 overflow-y-auto space-y-1 mt-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm transition-colors duration-200 ${
                active
                  ? 'active bg-blue-500 text-white font-medium shadow-sm'
                  : 'text-gray-200 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}

        <div className="mt-4 border-t border-blue-700 pt-3 space-y-1">
          <Link
            href="/profile"
            className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm transition-colors duration-200 ${
              isActive('/profile')
                ? 'active bg-blue-500 text-white font-medium shadow-sm'
                : 'text-gray-200 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mr-2.5" />
            <span>Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm text-gray-200 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2.5" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default NavBar;