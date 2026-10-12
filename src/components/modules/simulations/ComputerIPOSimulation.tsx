import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';
import {
  Cpu,
  Monitor,
  Keyboard,
  HardDrive,
  Power,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Play,
  Layers,
  ArrowRight
} from 'lucide-react';

interface HardwareComponent {
  id: string;
  name: string;
  desc: string;
  category: 'Input' | 'Proses' | 'Output' | 'Storage';
  iconType: 'keyboard' | 'cpu' | 'monitor' | 'disk';
}

export const ComputerIPOSimulation: React.FC = () => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();

  const components: HardwareComponent[] = [
    { id: 'h1', name: 'Keyboard QWERTY', desc: 'Mengetik teks & memasukkan perintah tombol', category: 'Input', iconType: 'keyboard' },
    { id: 'h2', name: 'Mouse Optik Laser', desc: 'Menggerakkan kursor & mengklik objek di layar', category: 'Input', iconType: 'keyboard' },
    { id: 'h3', name: 'Processor CPU Core i5', desc: 'Otak utama pemrosesan instruksi dan matematika', category: 'Proses', iconType: 'cpu' },
    { id: 'h4', name: 'Memori RAM 16GB DDR4', desc: 'Menampung data sementara saat aplikasi berjalan', category: 'Proses', iconType: 'cpu' },
    { id: 'h5', name: 'Monitor LED 24 Inci', desc: 'Menampilkan visual grafis piksel dan antarmuka', category: 'Output', iconType: 'monitor' },
    { id: 'h6', name: 'Speaker Audio Stereo', desc: 'Mengeluarkan suara nada dan penjelasan guru', category: 'Output', iconType: 'monitor' },
    { id: 'h7', name: 'SSD NVMe 512GB', desc: 'Penyimpanan permanen sistem operasi dan file', category: 'Storage', iconType: 'disk' },
    { id: 'h8', name: 'Flashdisk USB 64GB', desc: 'Media penyimpanan portabel untuk membawa tugas', category: 'Storage', iconType: 'disk' }
  ];

  const [placements, setPlacements] = useState<Record<string, 'Input' | 'Proses' | 'Output' | 'Storage'>>({});
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isCycleRunning, setIsCycleRunning] = useState(false);
  const [cycleStep, setCycleStep] = useState<number | null>(null);

  const categories: Array<'Input' | 'Proses' | 'Output' | 'Storage'> = ['Input', 'Proses', 'Output', 'Storage'];

  const handleSelectComp = (id: string) => {
    playClick();
    setSelectedCompId(id === selectedCompId ? null : id);
  };

  const handleAssignToSlot = (cat: 'Input' | 'Proses' | 'Output' | 'Storage') => {
    if (!selectedCompId) return;
    playClick();
    setPlacements((prev) => ({
      ...prev,
      [selectedCompId]: cat
    }));
    setSelectedCompId(null);
  };

  const handleStartCycle = async () => {
    playClick();
    // Verify all components placed
    let correctCount = 0;
    components.forEach((c) => {
      if (placements[c.id] === c.category) correctCount++;
    });

    if (correctCount < 6) {
      playError();
      alert('Rakit minimal 6 komponen pada slot yang tepat terlebih dahulu sebelum menyalakan siklus data!');
      return;
    }

    setIsPowerOn(true);
    setIsCycleRunning(true);

    // Sequence through IPO
    setCycleStep(1); // Input
    playSuccess();
    await new Promise((r) => setTimeout(r, 700));

    setCycleStep(2); // Proses
    playSuccess();
    await new Promise((r) => setTimeout(r, 700));

    setCycleStep(3); // Output
    playSuccess();
    await new Promise((r) => setTimeout(r, 700));

    setCycleStep(4); // Storage
    playFanfare();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsCycleRunning(false);
  };

  const handleReset = () => {
    playClick();
    setPlacements({});
    setSelectedCompId(null);
    setIsPowerOn(false);
    setIsCycleRunning(false);
    setCycleStep(null);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-blue-600 to-indigo-800 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
          <Cpu className="w-4 h-4" />
          <span>Laboratorium Perakitan Komputer & Siklus Alur Data IPO</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Simulator Siklus Kerja Komputer (Input - Proses - Output - Storage)
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          Sentuh komponen perangkat keras di bawah ini, tempatkan pada slot siklus kerja yang tepat,
          lalu tekan tombol "Nyalakan Komputer & Jalankan Siklus" untuk menyaksikan denyut data mengalir!
        </p>
      </div>

      {/* Main Bus Board with 4 IPO Slots */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isPowerOn ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              Status Sistem: {isPowerOn ? '⚡ KOMPUTER MENYALA & SIKLUS AKTIF' : '⚪ KOMPUTER DALAM KEADAAN MATI (OFF)'}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Rakitan</span>
          </button>
        </div>

        {/* 4 IPO Slot Containers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const isTarget = selectedCompId !== null;
            const assigned = components.filter((c) => placements[c.id] === cat);
            const isStepActive = cycleStep === idx + 1;

            return (
              <div
                key={cat}
                onClick={() => handleAssignToSlot(cat)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer min-h-[190px] flex flex-col justify-between ${
                  isStepActive
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/70 ring-4 ring-emerald-500/40 shadow-lg'
                    : isTarget
                    ? 'border-dashed border-blue-400 bg-blue-50/40 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>{cat}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Tahap {idx + 1}
                    </span>
                  </div>

                  {/* Installed items */}
                  <div className="space-y-1.5 pt-3">
                    {assigned.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic text-center py-4">
                        {selectedCompId ? '👉 Sentuh untuk menempatkan komponen' : 'Slot masih kosong'}
                      </p>
                    ) : (
                      assigned.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-xs flex items-center justify-between"
                        >
                          <span className="truncate">{item.name}</span>
                          {item.category === cat && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {selectedCompId && (
                  <div className="pt-2 text-center">
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-md text-[10px] font-bold shadow-xs">
                      + Pasang di Slot {cat}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleStartCycle}
            disabled={isCycleRunning}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all"
          >
            <Power className="w-4 h-4" />
            <span>
              {isCycleRunning ? 'Sedang Mengalirkan Denyut Data...' : '⚡ Nyalakan Komputer & Jalankan Siklus Data IPO'}
            </span>
          </button>
        </div>

        {/* Hardware Components Palette */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Pilih Komponen Hardware untuk Dirakit (Sentuh Komponen):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {components.map((c) => {
              const isSelected = selectedCompId === c.id;
              const isPlaced = placements[c.id] !== undefined;

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectComp(c.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer space-y-1 active:scale-95 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/70 ring-4 ring-blue-500/30'
                      : isPlaced
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400'
                  }`}
                >
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                    {c.name}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                    {c.desc}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    <span>{isPlaced ? `Terpasang: ${placements[c.id]}` : 'Belum dipasang'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
