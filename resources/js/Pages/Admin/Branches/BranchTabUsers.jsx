import React from 'react';

const BranchTabUsers = ({ users, formatDate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="bg-gray-900/60 text-gray-400 uppercase text-[10px]">
          <tr>
            <th className="px-4 py-3 rounded-l-lg">Nama</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 rounded-r-lg">Tanggal Bergabung</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {users && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-700/30">
                <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                <td className="px-4 py-3 text-gray-300">{u.email}</td>
                <td className="px-4 py-3 capitalize">
                  <span className="px-2 py-0.5 rounded bg-gray-700 border border-gray-600 text-gray-200">
                    {u.role || 'Staff'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{formatDate(u.created_at)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                Belum ada pengguna terikat di cabang ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTabUsers;