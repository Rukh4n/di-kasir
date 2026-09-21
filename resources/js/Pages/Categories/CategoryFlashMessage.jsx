import React from 'react'
import { CheckCircle, AlertCircle, ShieldAlert } from "lucide-react"

export default function CategoryFlashMessage({ showFlash, flash, flashMessage }) {
  if (!showFlash) return null

  return (
    <div
      className={`mb-6 p-4 rounded-xl text-white text-sm flex items-center gap-3 shadow-lg border transition-all duration-300 ${
        flash.success 
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
          : flash.error 
          ? 'bg-rose-950/80 border-rose-500/30 text-rose-200' 
          : 'bg-amber-950/80 border-amber-500/30 text-amber-200'
      }`}
    >
      {flash.success ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : flash.error ? (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      ) : (
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
      )}
      <span className="font-medium">{flashMessage}</span>
    </div>
  )
}
