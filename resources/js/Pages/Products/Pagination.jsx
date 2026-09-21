import React from 'react'
import { router } from '@inertiajs/react'

const Pagination = ({ products }) => {
  if (!products.links || products.links.length <= 1) return null

  return (
    <div className="px-5 py-4 bg-gray-900 border-t border-gray-800 flex items-center justify-between flex-wrap gap-3">
      <span className="text-xs text-gray-400">
        Menampilkan <span className="font-medium text-white">{products.from || 0}</span> - <span className="font-medium text-white">{products.to || 0}</span> dari <span className="font-medium text-white">{products.total || 0}</span> data
      </span>

      <div className="flex items-center gap-1.5">
        {products.links.map((link, index) => {
          const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;')
          const isNext = link.label.includes('Next') || link.label.includes('&raquo;')

          return (
            <button
              key={index}
              disabled={!link.url}
              onClick={() => link.url && router.visit(link.url)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                link.active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : link.url
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                  : 'bg-gray-900/50 text-gray-600 border border-gray-800/40 cursor-not-allowed'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Pagination