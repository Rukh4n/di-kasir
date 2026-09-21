import React from 'react';
import { X } from 'lucide-react';

export default function TransactionFlashMessage({ showFlash, flash, flashMessage, setShowFlash }) {
  if (!showFlash) return null;

  const isSuccess = flash?.success;
  const isError = flash?.error;

  return (
    <div 
      className={`mb-6 px-4 sm:px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-between gap-3 shadow-xl backdrop-blur-md ${
        isSuccess 
          ? 'bg-emerald-600/90 border border-emerald-500/80 text-emerald-50 shadow-emerald-950/20' 
          : isError 
          ? 'bg-rose-600/90 border border-rose-500/80 text-rose-50 shadow-rose-950/20' 
          : 'bg-amber-600/90 border border-amber-500/80 text-amber-50 shadow-amber-950/20'
      }`}
    >
      <span className="leading-relaxed break-words">{flashMessage}</span>
      
      <button 
        onClick={() => setShowFlash(false)} 
        className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0"
        title="Tutup"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}