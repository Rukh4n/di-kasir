import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const FlashAlert = ({ show, message, type }) => {
  if (!show) return null

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg transition-all duration-300 ${
        type === 'success'
          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
          : type === 'error'
          ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
          : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}

export default FlashAlert