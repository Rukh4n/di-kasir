import React from 'react';

export default function UserFlashMessage({ flash }) {
  if (!flash.success && !flash.error) return null;

  return (
    <>
      {flash.success && (
        <div className="mb-6 p-4 bg-emerald-600 border border-emerald-500 text-white rounded-xl shadow-sm text-sm font-medium flex items-center justify-between">
          <span>{flash.success}</span>
        </div>
      )}
      {flash.error && (
        <div className="mb-6 p-4 bg-rose-600 border border-rose-500 text-white rounded-xl shadow-sm text-sm font-medium flex items-center justify-between">
          <span>{flash.error}</span>
        </div>
      )}
    </>
  );
}