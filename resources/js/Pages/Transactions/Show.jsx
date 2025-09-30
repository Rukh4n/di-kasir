import React, { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Printer, Save } from 'lucide-react'

const Show = ({ transaction }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const generatePDF = (isPrint = false) => {
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 150], // ukuran thermal nota
    })

    doc.setFont('courier', 'normal')
    doc.setFontSize(12)
    doc.text('INVOICE', 40, 10, { align: 'center' })
    doc.setFontSize(8)
    doc.text(`No: ${transaction.invoice_number}`, 40, 15, { align: 'center' })

    doc.setFontSize(8)
    doc.text(`ID: ${transaction.id}`, 5, 25)
    doc.text(`Tanggal: ${new Date(transaction.created_at).toLocaleString()}`, 5, 30)

    autoTable(doc, {
      startY: 35,
      head: [['Item', 'Qty', 'Harga', 'Subtotal']],
      body: transaction.items.map((item) => [
        item.name,
        item.qty,
        parseFloat(item.price).toLocaleString(),
        (parseFloat(item.price) * item.qty).toLocaleString(),
      ]),
      theme: 'plain',
      styles: { fontSize: 8 },
      headStyles: { fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { halign: 'center', cellWidth: 10 },
        2: { halign: 'right', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 20 },
      },
    })

    let finalY = doc.lastAutoTable.finalY + 5
    doc.setFontSize(8)
    doc.text(`Total: ${parseFloat(transaction.total_price).toLocaleString()}`, 5, finalY)
    doc.text(`Tunai: ${parseFloat(transaction.cash_received).toLocaleString()}`, 5, finalY + 5)
    doc.text(`Kembalian: ${parseFloat(transaction.change).toLocaleString()}`, 5, finalY + 10)

    doc.setFontSize(7)
    doc.text('Terima kasih atas pembelian Anda!', 40, finalY + 20, { align: 'center' })

    if (isPrint) {
      const blobUrl = doc.output('bloburl')
      setPdfUrl(blobUrl)
      setShowModal(true)
    } else {
      doc.save(`${transaction.invoice_number}.pdf`)
    }
  }

  return (
    <div className="w-[220px] mx-auto bg-gray-900 text-gray-100 shadow rounded p-4 font-mono text-xs">
      <h1 className="text-center text-lg font-bold mb-1">INVOICE</h1>
      <p className="text-center text-[10px] mb-4">No: {transaction.invoice_number}</p>

      <div className="mb-3 space-y-1">
        <p><strong>ID:</strong> {transaction.id}</p>
        <p><strong>Tanggal:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
      </div>

      <div className="mb-3 border-t border-b border-gray-600 py-2 space-y-2">
        {transaction.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} x{item.qty}</span>
            <span>{(parseFloat(item.price) * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Total</span>
          <span>{parseFloat(transaction.total_price).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Tunai</span>
          <span>{parseFloat(transaction.cash_received).toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-gray-600 pt-1">
          <span>Kembalian</span>
          <span>{parseFloat(transaction.change).toLocaleString()}</span>
        </div>
      </div>

      <p className="text-center text-[10px] mt-4">Terima kasih atas pembelian Anda!</p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => generatePDF(true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded flex justify-center items-center gap-1"
        >
          <Printer size={16} />
        </button>
        <button
          onClick={() => generatePDF(false)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded flex justify-center items-center gap-1"
        >
          <Save size={16} />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 h-[500px] p-2 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded px-2 py-1 text-xs"
            >
              X
            </button>
            <iframe src={pdfUrl} title="Invoice Preview" className="w-full h-full border-0" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Show
