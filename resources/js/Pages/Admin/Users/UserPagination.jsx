import React from 'react';
import { Link } from '@inertiajs/react';

export default function UserPagination({ users }) {
  if (!users.links || users.links.length <= 1) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="text-xs text-gray-400 order-2 sm:order-1">
          Menampilkan {users.from || 0} - {users.to || 0} dari {users.total} data
        </div>
        <div className="flex flex-wrap justify-center gap-1 order-1 sm:order-2 w-full sm:w-auto">
          {users.links.map((link, idx) => (
            <Link
              key={idx}
              href={link.url || '#'}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                link.active
                  ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                  : link.url
                  ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'text-gray-600 border-gray-800/40 pointer-events-none'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}