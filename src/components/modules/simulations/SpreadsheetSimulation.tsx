import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';
import {
  FileSpreadsheet,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Hash,
  Lightbulb
} from 'lucide-react';

interface SpreadsheetSimulationProps {
  topicTitle: string;
}

export const SpreadsheetSimulation: React.FC<SpreadsheetSimulationProps> = ({ topicTitle }) => {
  const { playClick, playSuccess, playFanfare } = useTheme();

  // Initial table data (Koperasi Sekolah SMPN 5 Kroya)
  const initialData = [
    { row: 2, kode: 'BRG-01', nama: 'Buku Tulis SPENMAKRO', harga: 4000, jumlah: 5 },
    { row: 3, kode: 'BRG-02', nama: 'Penggaris Segitiga', harga: 2500, jumlah: 8 },
    { row: 4, kode: 'BRG-03', nama: 'Pulpen Gel Biru', harga: 3000, jumlah: 10 },
    { row: 5, kode: 'BRG-04', nama: 'Penghapus Pensil', harga: 1500, jumlah: 4 }
  ];

  const [tableData, setTableData] = useState(initialData);
  const [activeFormulaKey, setActiveFormulaKey] = useState<string>('sum-harga');
  const [highlightedRange, setHighlightedRange] = useState<string>('C2:C5');
  const [isCalculated, setIsCalculated] = useState<boolean>(true);

  // Available interactive formula presets
  const formulas = [
    {
      key: 'sum-harga',
      name: 'Total Harga (=SUM)',
      syntax: '=SUM(C2:C5)',
      range: 'C2:C5',
      desc: 'Menjumlahkan harga semua barang di koperasi sekolah',
      calc: () => tableData.reduce((acc, item) => acc + item.harga, 0),
      format: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
      explanation: 'Formula menjumlahkan nilai sel C2 (4.000) + C3 (2.500) + C4 (3.000) + C5 (1.500).'
    },
    {
      key: 'average-harga',
      name: 'Rata-Rata Harga (=AVERAGE)',
      syntax: '=AVERAGE(C2:C5)',
      range: 'C2:C5',
      desc: 'Menghitung rata-rata harga satuan barang koperasi',
      calc: () => tableData.reduce((acc, item) => acc + item.harga, 0) / tableData.length,
      format: (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`,
      explanation: 'Formula menghitung total harga (11.000) dibagi 4 macam barang = 2.750.'
    },
    {
      key: 'max-harga',
      name: 'Harga Tertinggi (=MAX)',
      syntax: '=MAX(C2:C5)',
      range: 'C2:C5',
      desc: 'Mencari harga barang paling mahal di koperasi',
      calc: () => Math.max(...tableData.map((item) => item.harga)),
      format: (val: number) => `Rp ${val.toLocaleString('id-ID')} (Buku Tulis)`,
      explanation: 'Nilai terbesar di kolom C ditemukan pada baris 2 yaitu Buku Tulis (Rp 4.000).'
    },
    {
      key: 'min-harga',
      name: 'Harga Termurah (=MIN)',
      syntax: '=MIN(C2:C5)',
      range: 'C2:C5',
      desc: 'Mencari harga barang paling murah di koperasi',
      calc: () => Math.min(...tableData.map((item) => item.harga)),
      format: (val: number) => `Rp ${val.toLocaleString('id-ID')} (Penghapus)`,
      explanation: 'Nilai terkecil di kolom C ditemukan pada baris 5 yaitu Penghapus (Rp 1.500).'
    },
    {
      key: 'vlookup-brg',
      name: 'Cari Nama (=VLOOKUP)',
      syntax: '=VLOOKUP("BRG-03"; A2:D5; 2; FALSE)',
      range: 'A2:D5',
      desc: 'Mencari nama barang berdasarkan kode BRG-03 pada kolom ke-2',
      calc: () => 1,
      format: () => 'Pulpen Gel Biru',
      explanation: 'VLOOKUP mencari "BRG-03" di kolom A, lalu mengambil teks di kolom ke-2 (Nama).'
    },
    {
      key: 'if-stok',
      name: 'Uji Stok Aman (=IF)',
      syntax: '=IF(D2>=5; "Stok Cukup"; "Pesan Lagi")',
      range: 'D2:D5',
      desc: 'Memeriksa apakah jumlah stok Buku Tulis >= 5',
      calc: () => 1,
      format: () => 'Stok Cukup (Karena 5 >= 5)',
      explanation: 'Kondisi bernilai TRUE karena jumlah Buku Tulis adalah 5 (memenuhi syarat >= 5).'
    }
  ];

  const currentFormula = formulas.find((f) => f.key === activeFormulaKey) || formulas[0];

  const handleSelectFormula = (key: string, range: string) => {
    playClick();
    setActiveFormulaKey(key);
    setHighlightedRange(range);
    setIsCalculated(true);
    playSuccess();
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const updated = [...tableData];
    updated[index].harga = Math.max(500, newPrice);
    setTableData(updated);
  };

  const handleRunEvaluation = () => {
    playClick();
    setIsCalculated(true);
    playFanfare();
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
  };

  const handleResetData = () => {
    playClick();
    setTableData(initialData);
    setActiveFormulaKey('sum-harga');
    setHighlightedRange('C2:C5');
  };

  const isCellHighlighted = (col: string, row: number) => {
    if (highlightedRange === 'C2:C5') return col === 'C' && row >= 2 && row <= 5;
    if (highlightedRange === 'D2:D5') return col === 'D' && row >= 2 && row <= 5;
    if (highlightedRange === 'A2:D5') return row >= 2 && row <= 5;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-emerald-600 to-teal-700 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Laboratorium Interaktif Lembar Kerja Spreadsheet</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Simulator Formula & Fungsi Spreadsheet Nilai & Koperasi
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Sentuh rumus spreadsheet di bawah ini untuk melihat bagaimana sel di tabel menyala (terpilih),
          kalkulasi dieksekusi secara instan, dan hasil dihitung otomatis secara langsung!
        </p>
      </div>

      {/* Formula Selector Bar (IFP Touch Buttons) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Pilih Formula untuk Diuji (Sentuh Tombol):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {formulas.map((f) => {
            const isActive = activeFormulaKey === f.key;
            return (
              <button
                key={f.key}
                onClick={() => handleSelectFormula(f.key, f.range)}
                className={`p-3 rounded-2xl border-2 text-left transition-all font-semibold active:scale-95 ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'
                }`}
              >
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                  {f.name}
                </div>
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  {f.syntax}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Spreadsheet Grid & Execution Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* The Spreadsheet Grid */}
        <div className="lg:col-span-8 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Tabel Referensi: Koperasi Siswa SPENMAKRO
              </span>
            </div>
            <button
              onClick={handleResetData}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Tabel</span>
            </button>
          </div>

          {/* Formula Bar Simulation */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border">
              fx
            </span>
            <span className="text-slate-500 font-bold">Formula Aktif:</span>
            <span className="font-black text-slate-900 dark:text-white">{currentFormula.syntax}</span>
          </div>

          {/* Grid Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono">
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center w-10">#</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold">A (Kode)</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold">B (Nama Barang)</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-right font-bold">C (Harga Satuan)</th>
                  <th className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-bold">D (Stok)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => {
                  const isA = isCellHighlighted('A', item.row);
                  const isB = isCellHighlighted('B', item.row);
                  const isC = isCellHighlighted('C', item.row);
                  const isD = isCellHighlighted('D', item.row);

                  return (
                    <tr key={item.row} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                        {item.row}
                      </td>
                      <td
                        className={`p-2.5 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold transition-all ${
                          isA ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        {item.kode}
                      </td>
                      <td
                        className={`p-2.5 border border-slate-200 dark:border-slate-700 font-medium transition-all ${
                          isB ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        {item.nama}
                      </td>
                      <td
                        className={`p-2.5 border border-slate-200 dark:border-slate-700 text-right font-mono font-bold transition-all ${
                          isC ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Rp {item.harga.toLocaleString('id-ID')}</span>
                          <button
                            onClick={() => handlePriceChange(item.row - 2, item.harga + 500)}
                            className="px-1 text-[10px] bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white rounded"
                            title="Tambah Rp 500 untuk tes recalculation live"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td
                        className={`p-2.5 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold transition-all ${
                          isD ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        {item.jumlah} pcs
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            💡 Tips Interaktif: Klik tanda (+) di kolom harga untuk mengubah angka, formula spreadsheet akan menghitung ulang otomatis!
          </p>
        </div>

        {/* Live Calculation Output Card */}
        <div className="lg:col-span-4 p-5 rounded-3xl border-2 border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Hasil Eksekusi Rumus</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Nilai yang Dihasilkan:</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {currentFormula.format(currentFormula.calc())}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Penjelasan Logika Komputasi:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {currentFormula.explanation}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunEvaluation}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Uji Ulang Kalkulasi & Rayakan!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
