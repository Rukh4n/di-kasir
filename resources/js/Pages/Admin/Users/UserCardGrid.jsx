import React from 'react';
import { Users, Shield, Mail, Building, Edit as EditIcon, Trash2 } from 'lucide-react';

export default function UserCardGrid({ userList, openEditModal, openDeleteModal }) {
  if (userList.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-400 text-sm">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-300">Belum ada data user</h3>
        <p className="text-xs text-gray-500 mt-1">Data pengguna yang dibuat akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {userList.map((user) => (
        <div
          key={user.id}
          className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition duration-300 flex flex-col justify-between group relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded-full truncate">
                  ID: {user.id}
                </span>
              </div>

              {user.role === 'admin' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-400 uppercase tracking-wider bg-amber-950 border border-amber-800 shrink-0">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-indigo-300 uppercase tracking-wider bg-indigo-950 border border-indigo-800 shrink-0">
                  <Shield className="w-3 h-3" /> Staff
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
              {user.name}
            </h3>

            <div className="space-y-1.5 text-xs text-gray-400 mt-3">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="truncate">{user.email || '-'}</span>
              </div>
              {user.branch && (
                <div className="flex items-center gap-2 min-w-0">
                  <Building className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="truncate">{user.branch.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 mb-0 border-t border-gray-800 flex items-center justify-end gap-1.5">
            <button
              onClick={() => openEditModal(user)}
              className="p-2 bg-gray-800 hover:bg-amber-600 text-gray-300 hover:text-white rounded-xl transition border border-gray-700 hover:border-amber-500"
              title="Edit"
            >
              <EditIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => openDeleteModal(user)}
              className="p-2 bg-gray-800 hover:bg-rose-600 text-gray-300 hover:text-white rounded-xl transition border border-gray-700 hover:border-rose-500"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}