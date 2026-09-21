import React, { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Printer, Save, Settings, X, Plus } from 'lucide-react'

const Show = ({ transaction }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [savedPrinters, setSavedPrinters] = useState([])
  const [selectedPrinterId, setSelectedPrinterId] = useState('')
  const [showPrinterModal, setShowPrinterModal] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const printers = JSON.parse(localStorage.getItem('saved_bluetooth_printers')) || []
    setSavedPrinters(printers)
    if (printers.length > 0) {
      setSelectedPrinterId(printers[0].id)
    }
  }, [])

  const handleAddPrinter = async () => {
    try {
      setStatus('Mencari perangkat...')
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      })

      const newPrinter = {
        id: device.id,
        name: device.name || 'Printer Thermal'
      }

      const existingPrinters = JSON.parse(localStorage.getItem('saved_bluetooth_printers')) || []
      const isExist = existingPrinters.some(p => p.id === newPrinter.id)

      let updatedPrinters
      if (!isExist) {
        updatedPrinters = [...existingPrinters, newPrinter]
        localStorage.setItem('saved_bluetooth_printers', JSON.stringify(updatedPrinters))
        setSavedPrinters(updatedPrinters)
      }

      setSelectedPrinterId(newPrinter.id)
      setStatus(`Printer "${newPrinter.name}" berhasil disimpan!`)
    } catch (error) {
      console.error('Gagal memilih printer:', error)
      setStatus('Gagal: ' + error.message)
    }
  }

  const handleBluetoothPrint = async () => {
    if (savedPrinters.length === 0) {
      setShowPrinterModal(true)
      return
    }

    if (savedPrinters.length > 1 && !selectedPrinterId) {
      setShowPrinterModal(true)
      return
    }

    try {
      setStatus('Menghubungkan ke printer...')
      const targetPrinter = savedPrinters.find(p => p.id === selectedPrinterId) || savedPrinters[0]

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: targetPrinter.name }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      })

      const server = await device.gatt.connect()
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb')
      const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb')

      const encoder = new TextEncoder()
      let commands = '\x1B\x40' // Init
      commands += '\x1B\x61\x01' // Center
      commands += 'INVOICE\n'
      commands += `No: ${transaction.invoice_number}\n`
      commands += '--------------------------------\n'
      commands += '\x1B\x61\x00' // Left
      commands += `ID: ${transaction.id}\n`
      commands += `Tanggal: ${new Date(transaction.created_at).toLocaleString()}\n`
      commands += '--------------------------------\n'
      
      transaction.items.forEach(item => {
        const subtotal = (parseFloat(item.price) * item.qty).toLocaleString()
        commands += `${item.name} x${item.qty}\n`
        commands += `  Rp ${parseFloat(item.price).toLocaleString()} = Rp ${subtotal}\n`
      })

      commands += '--------------------------------\n'
      commands += `Total: Rp ${parseFloat(transaction.total_price).toLocaleString()}\n`
      commands += `Tunai: Rp ${parseFloat(transaction.cash_received).toLocaleString()}\n`
      commands += `Kembalian: Rp ${parseFloat(transaction.change).toLocaleString()}\n`
      commands += '--------------------------------\n'
      commands += '\x1B\x61\x01' // Center
      commands += 'Terima kasih atas pembelian Anda!\n\n\n'
      commands += '\x1D\x56\x41\x10' // Cut

      await characteristic.writeValue(encoder.encode(commands))
      setStatus('Berhasil mencetak via Bluetooth!')
    } catch (error) {
      console.error('Gagal cetak bluetooth:', error)
      setStatus('Gagal Bluetooth: ' + error.message)
    }
  }

  const generatePDF = (isPrint = false) => {
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 150],
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
    <div className="w-[260px] mx-auto bg-slate-900 border border-slate-800 text-slate-200 shadow-2xl rounded-2xl p-5 font-mono text-xs relative backdrop-blur-md">
      {/* Header Nota */}
      <div className="flex justify-between items-start mb-2">
        <div className="w-full text-center">
          <h1 className="text-base font-extrabold tracking-wider text-white">INVOICE</h1>
          <p className="text-[10px] text-slate-400 mt-0.5">{transaction.invoice_number}</p>
        </div>
        <button 
          onClick={() => setShowPrinterModal(true)}
          className="absolute top-4 right-4 text-slate-400 hover:text-blue-400 transition-colors p-1 bg-slate-800/60 rounded-lg border border-slate-700/50"
          title="Pengaturan Printer"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Detail Transaksi */}
      <div className="mb-3 space-y-1 text-[11px] text-slate-300 border-b border-slate-800 pb-2">
        <p className="truncate"><strong>ID:</strong> <span className="text-slate-400">{transaction.id}</span></p>
        <p><strong>Tanggal:</strong> <span className="text-slate-400">{new Date(transaction.created_at).toLocaleString()}</span></p>
      </div>

      {/* List Item */}
      <div className="mb-3 border-b border-slate-800 py-2 space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {transaction.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start gap-2">
            <span className="text-slate-300 font-medium">{item.name} <span className="text-blue-400">x{item.qty}</span></span>
            <span className="text-slate-400 shrink-0">{(parseFloat(item.price) * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Ringkasan Biaya */}
      <div className="space-y-1.5 text-slate-300 border-b border-slate-800 pb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Total</span>
          <span className="font-semibold text-slate-200">Rp {parseFloat(transaction.total_price).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Tunai</span>
          <span>Rp {parseFloat(transaction.cash_received).toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-blue-400 pt-1 border-t border-slate-800/60">
          <span>Kembalian</span>
          <span>Rp {parseFloat(transaction.change).toLocaleString()}</span>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-500 mt-3 italic">Terima kasih atas pembelian Anda!</p>
      {status && <p className="text-center text-[10px] text-amber-400 mt-2 bg-amber-950/30 border border-amber-900/40 rounded py-1 px-2 animate-pulse">{status}</p>}

      {/* Tombol Aksi Utama */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleBluetoothPrint}
          className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white py-2 rounded-xl flex justify-center items-center gap-1.5 font-sans font-medium shadow-lg shadow-blue-950/40"
          title="Cetak Bluetooth"
        >
          <Printer size={15} />
          <span>Print</span>
        </button>
        <button
          onClick={() => generatePDF(false)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-200 py-2 rounded-xl flex justify-center items-center gap-1.5 font-sans font-medium border border-slate-700"
          title="Simpan PDF"
        >
          <Save size={15} />
          <span>PDF</span>
        </button>
      </div>

      {/* Modal Pengaturan Printer */}
      {showPrinterModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs p-5 relative shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Settings size={16} className="text-blue-400" /> Pengaturan Printer
              </h3>
              <button 
                onClick={() => setShowPrinterModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-lg border border-slate-700"
              >
                <X size={14} />
              </button>
            </div>
            
            {savedPrinters.length > 0 ? (
              <div className="mb-4">
                <label className="block font-sans text-xs font-medium text-slate-400 mb-1.5">
                  Pilih Printer Aktif ({savedPrinters.length}):
                </label>
                <select 
                  value={selectedPrinterId} 
                  onChange={(e) => setSelectedPrinterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {savedPrinters.map((printer) => (
                    <option key={printer.id} value={printer.id} className="bg-slate-900">
                      {printer.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-rose-950/30 border border-rose-900/40 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs text-rose-400 font-sans">Belum ada printer tersimpan.</p>
              </div>
            )}

            <div className="flex flex-col gap-2 font-sans">
              <button 
                onClick={handleAddPrinter}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/40"
              >
                <Plus size={14} /> Tambah Perangkat Baru
              </button>
              <button 
                onClick={() => setShowPrinterModal(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 rounded-xl text-xs font-medium border border-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview PDF */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm h-[500px] p-3 relative shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-sans font-semibold text-slate-300">Preview Invoice PDF</span>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white p-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe src={pdfUrl} title="Invoice Preview" className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Show