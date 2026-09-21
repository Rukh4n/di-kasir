import React from 'react';
import { Building2, MapPin, Phone } from 'lucide-react';

const BranchHeaderInfo = ({ branch }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Informasi Cabang</p>
            <h3 className="text-base font-semibold text-white mt-0.5">{branch.name}</h3>
            <p className="text-xs text-gray-400 mt-1">Kode: {branch.code}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Alamat</p>
            <p className="text-sm text-gray-200 mt-0.5">{branch.address || 'Alamat belum diatur'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Kontak Telepon</p>
            <p className="text-sm text-gray-200 mt-0.5">{branch.phone || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchHeaderInfo;