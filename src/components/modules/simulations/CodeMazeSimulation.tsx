import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  RotateCcw,
  Bot,
  Star,
  Flag,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const CodeMazeSimulation: React.FC = () => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();

  // Grid dimensions 4x4
  // Robot starts at (0, 0) facing 'EAST'
  // Star at (1, 1)
  // Flag at (2, 2)

  const defaultStack = [
    { id: 'b1', text: 'MULAI Program', type: 'start' },
    { id: 'b2', text: 'MAJU 1 Langkah', type: 'move' },
    { id: 'b3', text: 'PUTAR KANAN 90°', type: 'turn' },
    { id: 'b4', text: 'MAJU 1 Langkah', type: 'move' },
    { id: 'b5', text: 'AMBIL BINTANG ⭐', type: 'action' },
    { id: 'b6', text: 'MAJU 1 Langkah', type: 'move' },
    { id: 'b7', text: 'PUTAR KIRI 90°', type: 'turn' },
    { id: 'b8', text: 'MAJU 1 Langkah', type: 'move' },
    { id: 'b9', text: 'SELESAI & Kibarkan Bendera 🏁', type: 'finish' }
  ];

  const [codeStack, setCodeStack] = useState(defaultStack);
  const [robotPos, setRobotPos] = useState<{ x: number; y: number; dir: 'N' | 'E' | 'S' | 'W' }>({
    x: 0,
    y: 0,
    dir: 'E'
  });
  const [starCollected, setStarCollected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<'idle' | 'success' | 'failed'>('idle');

  const handleRunProgram = async () => {
    playClick();
    setIsRunning(true);
    setGameResult('idle');
    setStarCollected(false);

    // Initial state
    let curX = 0;
    let curY = 0;
    let curDir: 'N' | 'E' | 'S' | 'W' = 'E';
    setRobotPos({ x: 0, y: 0, dir: 'E' });

    for (let i = 0; i < codeStack.length; i++) {
      setActiveStepIdx(i);
      const block = codeStack[i];

      await new Promise((res) => setTimeout(res, 600));

      if (block.type === 'move') {
        if (curDir === 'E') curX = Math.min(3, curX + 1);
        else if (curDir === 'W') curX = Math.max(0, curX - 1);
        else if (curDir === 'S') curY = Math.min(3, curY + 1);
        else if (curDir === 'N') curY = Math.max(0, curY - 1);
        setRobotPos({ x: curX, y: curY, dir: curDir });
      } else if (block.type === 'turn') {
        if (block.text.includes('KANAN')) {
          const nextDir: Record<string, 'N' | 'E' | 'S' | 'W'> = { E: 'S', S: 'W', W: 'N', N: 'E' };
          curDir = nextDir[curDir];
        } else {
          const nextDir: Record<string, 'N' | 'E' | 'S' | 'W'> = { E: 'N', N: 'W', W: 'S', S: 'E' };
          curDir = nextDir[curDir];
        }
        setRobotPos({ x: curX, y: curY, dir: curDir });
      } else if (block.type === 'action') {
        if (curX === 1 && curY === 1) {
          setStarCollected(true);
          playSuccess();
        }
      }
    }

    setIsRunning(false);
    setActiveStepIdx(null);

    // Check goal condition (curX === 2 && curY === 2)
    if (curX === 2 && curY === 2) {
      setGameResult('success');
      playFanfare();
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
    } else {
      setGameResult('failed');
      playError();
    }
  };

  const handleReset = () => {
    playClick();
    setRobotPos({ x: 0, y: 0, dir: 'E' });
    setStarCollected(false);
    setIsRunning(false);
    setActiveStepIdx(null);
    setGameResult('idle');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-purple-600 to-indigo-700 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200">
          <Code2 className="w-4 h-4" />
          <span>Laboratorium Logika Algoritma & Pemrograman Visual</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Simulator Blok Kode & Robot Penjelajah Labirin (Blockly Runner)
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
          Amati bagaimana komputer mengeksekusi instruksi prosedural langkah demi langkah secara berurutan.
          Jalankan algoritma agar robot mengambil bintang emas dan mencapai garis finish!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Maze Grid (4x4) */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Arena Grid Peta Misi (4x4 Matrix)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Posisi Robot: ({robotPos.x}, {robotPos.y}) Arah: {robotPos.dir}
            </span>
          </div>

          {/* The 4x4 Grid Board */}
          <div className="grid grid-cols-4 gap-2.5 max-w-[340px] sm:max-w-[380px] mx-auto p-3.5 bg-slate-100 dark:bg-slate-950 rounded-3xl border-2 border-slate-300 dark:border-slate-800 shadow-inner">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => {
                const isRobot = robotPos.x === col && robotPos.y === row;
                const isStar = col === 1 && row === 1;
                const isFlag = col === 2 && row === 2;
                const isStart = col === 0 && row === 0;

                return (
                  <div
                    key={`${col}-${row}`}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border ${
                      isRobot
                        ? 'bg-purple-500/20 dark:bg-purple-950/60 border-purple-500 shadow-md ring-4 ring-purple-500/30'
                        : isFlag
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400'
                        : isStar && !starCollected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-slate-400 absolute top-1 left-1.5">
                      {col},{row}
                    </span>

                    {/* Robot Avatar */}
                    {isRobot && (
                      <div className="animate-bounce">
                        <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 drop-shadow-md" />
                      </div>
                    )}

                    {/* Star Collectible */}
                    {isStar && !isRobot && (
                      <div className={starCollected ? 'opacity-20' : 'animate-pulse'}>
                        <Star className="w-6 h-6 text-amber-500 fill-amber-400 drop-shadow-sm" />
                      </div>
                    )}

                    {/* Finish Flag */}
                    {isFlag && !isRobot && (
                      <div>
                        <Flag className="w-6 h-6 text-emerald-600 fill-emerald-500" />
                      </div>
                    )}

                    {isStart && !isRobot && (
                      <span className="text-[10px] font-bold text-slate-400">START</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Feedback Banner */}
          {gameResult === 'success' && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-1 animate-in fade-in">
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Misi Sempurna! Robot Berhasil Mengambil Bintang & Mencapai Finish!</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Algoritma sekuensial yang kamu eksekusi berhasil 100% tanpa kesalahan logika.
              </p>
            </div>
          )}

          {gameResult === 'failed' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-center text-xs font-bold text-rose-700 dark:text-rose-300">
              Robot belum mencapai titik finish (2,2). Klik Reset dan coba jalankan kembali!
            </div>
          )}
        </div>

        {/* Code Stack Editor Box */}
        <div className="lg:col-span-5 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tumpukan Blok Kode (Urutan Logika):
              </span>
              <span className="text-xs font-mono text-purple-600 font-bold">
                {codeStack.length} Baris
              </span>
            </div>

            {/* List of blocks */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {codeStack.map((block, idx) => {
                const isCurrent = activeStepIdx === idx;

                return (
                  <div
                    key={block.id}
                    className={`p-2.5 rounded-xl border-2 font-mono text-xs font-bold transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 shadow-md ring-2 ring-purple-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold w-4">{idx + 1}</span>
                      <span>{block.text}</span>
                    </div>

                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleRunProgram}
              disabled={isRunning}
              className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'Mengeksekusi Kode...' : 'Jalankan Kode Algoritma ▶'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
