import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';
import {
  Code2,
  FileCode,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCw,
  HelpCircle,
  Lightbulb,
  Check,
  Zap,
  Layers,
  SlidersHorizontal,
  Compass,
  Star,
  Flag,
  Bot
} from 'lucide-react';

export const CodeMazeSimulation: React.FC = () => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();

  // Mode Tab: 1. Lab Pseudocode & Algoritma Robot, 2. Studio Program Sederhana Siswa
  const [activeSubMode, setActiveSubMode] = useState<'pseudocode-maze' | 'simple-program'>('pseudocode-maze');

  // =========================================================================
  // BAGIAN 1: SIMULASI MEMBUAT PSEUDOCODE & ALGORITMA ROBOT INTERAKTIF
  // =========================================================================

  interface InstructionBlock {
    id: string;
    action: 'MOVE' | 'TURN_RIGHT' | 'TURN_LEFT' | 'COLLECT' | 'IF_OBSTACLE';
    label: string;
    pseudocode: string;
    flowchartSymbol: 'Proses' | 'Keputusan' | 'Aksi';
  }

  // Bank instruksi yang bisa dipilih siswa
  const availableInstructions: { action: InstructionBlock['action']; label: string; pseudocode: string; flowchart: 'Proses' | 'Keputusan' | 'Aksi' }[] = [
    { action: 'MOVE', label: 'MAJU 1 Langkah', pseudocode: 'LANGKAH: maju_satu_petak()', flowchart: 'Proses' },
    { action: 'TURN_RIGHT', label: 'PUTAR KANAN 90°', pseudocode: 'ARAH: putar_arah_kanan()', flowchart: 'Proses' },
    { action: 'TURN_LEFT', label: 'PUTAR KIRI 90°', pseudocode: 'ARAH: putar_arah_kiri()', flowchart: 'Proses' },
    { action: 'COLLECT', label: 'AMBIL BINTANG ⭐', pseudocode: 'AKSI: ambil_item(bintang)', flowchart: 'Aksi' },
    { action: 'IF_OBSTACLE', label: 'JIKA Ada Batu Belok Kanan', pseudocode: 'JIKA rintangan_di_depan() MAKA putar_kanan()', flowchart: 'Keputusan' }
  ];

  // Preset Level Algoritma
  const levels = [
    {
      id: 1,
      title: 'Level 1: Menjemput Bintang & Masuk Garis Finish',
      starPos: { x: 1, y: 1 },
      goalPos: { x: 2, y: 2 },
      obstaclePos: null,
      initialDirection: 'E' as 'N' | 'E' | 'S' | 'W',
      recommendedMaxBlocks: 9,
      hint: 'Maju 1 -> Putar Kanan -> Maju 1 -> Ambil Bintang -> Maju 1 -> Putar Kiri -> Maju 1 -> Selesai'
    },
    {
      id: 2,
      title: 'Level 2: Menghindari Batu Rintangan (Algoritma Jalur Alternatif)',
      starPos: { x: 2, y: 0 },
      goalPos: { x: 3, y: 3 },
      obstaclePos: { x: 1, y: 0 },
      initialDirection: 'S' as 'N' | 'E' | 'S' | 'W',
      recommendedMaxBlocks: 10,
      hint: 'Robot menghadap Selatan. Karena di (1,0) ada batu, putar ke bawah dulu lalu belok mengelilingi batu!'
    }
  ];

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = levels[currentLevelIdx];

  // Blok pseudocode yang sedang disusun siswa
  const [studentProgram, setStudentProgram] = useState<InstructionBlock[]>([
    { id: 'step-1', action: 'MOVE', label: 'MAJU 1 Langkah', pseudocode: 'LANGKAH: maju_satu_petak()', flowchartSymbol: 'Proses' },
    { id: 'step-2', action: 'TURN_RIGHT', label: 'PUTAR KANAN 90°', pseudocode: 'ARAH: putar_arah_kanan()', flowchartSymbol: 'Proses' },
    { id: 'step-3', action: 'MOVE', label: 'MAJU 1 Langkah', pseudocode: 'LANGKAH: maju_satu_petak()', flowchartSymbol: 'Proses' },
    { id: 'step-4', action: 'COLLECT', label: 'AMBIL BINTANG ⭐', pseudocode: 'AKSI: ambil_item(bintang)', flowchartSymbol: 'Aksi' }
  ]);

  const [robotPos, setRobotPos] = useState<{ x: number; y: number; dir: 'N' | 'E' | 'S' | 'W' }>({
    x: 0,
    y: 0,
    dir: 'E'
  });
  const [starCollected, setStarCollected] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeExecIdx, setActiveExecIdx] = useState<number | null>(null);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [mazeResult, setMazeResult] = useState<'idle' | 'success' | 'failed' | 'hit_obstacle'>('idle');

  // Reset arena saat ganti level
  useEffect(() => {
    resetMazeArena();
  }, [currentLevelIdx]);

  const resetMazeArena = () => {
    setRobotPos({ x: 0, y: 0, dir: currentLevel.initialDirection });
    setStarCollected(false);
    setIsExecuting(false);
    setActiveExecIdx(null);
    setMazeResult('idle');
    setRunLog([]);
  };

  // Tambah blok pseudocode
  const handleAddInstruction = (inst: typeof availableInstructions[0]) => {
    playClick();
    if (studentProgram.length >= 12) return;
    const newBlock: InstructionBlock = {
      id: `step-${Date.now()}-${Math.random()}`,
      action: inst.action,
      label: inst.label,
      pseudocode: inst.pseudocode,
      flowchartSymbol: inst.flowchart
    };
    setStudentProgram((prev) => [...prev, newBlock]);
  };

  // Hapus blok pseudocode
  const handleRemoveInstruction = (idx: number) => {
    playClick();
    setStudentProgram((prev) => prev.filter((_, i) => i !== idx));
  };

  // Pindahkan urutan instruksi ke atas/bawah
  const handleMoveInstruction = (idx: number, direction: 'up' | 'down') => {
    playClick();
    const newArr = [...studentProgram];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
    setStudentProgram(newArr);
  };

  // Eksekusi Pseudocode Langkah demi Langkah
  const handleExecuteAlgorithm = async () => {
    playClick();
    setIsExecuting(true);
    setMazeResult('idle');
    setStarCollected(false);
    setRunLog(['[Sistem]: Memulai pembacaan Pseudocode & Algoritma Robot...']);

    let curX = 0;
    let curY = 0;
    let curDir = currentLevel.initialDirection;
    let collected = false;
    let hitObstacle = false;

    setRobotPos({ x: 0, y: 0, dir: curDir });

    for (let i = 0; i < studentProgram.length; i++) {
      if (hitObstacle) break;

      setActiveExecIdx(i);
      const step = studentProgram[i];

      // Add log
      setRunLog((prev) => [...prev, `[Baris ${i + 1}]: Eksekusi ${step.pseudocode}`]);
      await new Promise((resolve) => setTimeout(resolve, 650));

      if (step.action === 'MOVE') {
        let nextX = curX;
        let nextY = curY;
        if (curDir === 'E') nextX = Math.min(3, curX + 1);
        else if (curDir === 'W') nextX = Math.max(0, curX - 1);
        else if (curDir === 'S') nextY = Math.min(3, curY + 1);
        else if (curDir === 'N') nextY = Math.max(0, curY - 1);

        // Cek rintangan batu
        if (currentLevel.obstaclePos && nextX === currentLevel.obstaclePos.x && nextY === currentLevel.obstaclePos.y) {
          hitObstacle = true;
          setRunLog((prev) => [...prev, `[PERINGATAN]: Robot menabrak rintangan batu di (${nextX}, ${nextY})!`]);
          break;
        }

        curX = nextX;
        curY = nextY;
        setRobotPos({ x: curX, y: curY, dir: curDir });
      } else if (step.action === 'TURN_RIGHT') {
        const nextMap: Record<string, 'N' | 'E' | 'S' | 'W'> = { E: 'S', S: 'W', W: 'N', N: 'E' };
        curDir = nextMap[curDir];
        setRobotPos({ x: curX, y: curY, dir: curDir });
      } else if (step.action === 'TURN_LEFT') {
        const nextMap: Record<string, 'N' | 'E' | 'S' | 'W'> = { E: 'N', N: 'W', W: 'S', S: 'E' };
        curDir = nextMap[curDir];
        setRobotPos({ x: curX, y: curY, dir: curDir });
      } else if (step.action === 'COLLECT') {
        if (curX === currentLevel.starPos.x && curY === currentLevel.starPos.y) {
          collected = true;
          setStarCollected(true);
          playSuccess();
          setRunLog((prev) => [...prev, `[SUKSES]: ⭐ Bintang berhasil dikumpulkan di koordinat (${curX}, ${curY})!`]);
        } else {
          setRunLog((prev) => [...prev, `[INFO]: Tidak ada bintang di koordinat (${curX}, ${curY}).`]);
        }
      } else if (step.action === 'IF_OBSTACLE') {
        // Percabangan logika IF
        let checkX = curX;
        let checkY = curY;
        if (curDir === 'E') checkX = Math.min(3, curX + 1);
        else if (curDir === 'W') checkX = Math.max(0, curX - 1);
        else if (curDir === 'S') checkY = Math.min(3, curY + 1);
        else if (curDir === 'N') checkY = Math.max(0, curY - 1);

        if (currentLevel.obstaclePos && checkX === currentLevel.obstaclePos.x && checkY === currentLevel.obstaclePos.y) {
          const nextMap: Record<string, 'N' | 'E' | 'S' | 'W'> = { E: 'S', S: 'W', W: 'N', N: 'E' };
          curDir = nextMap[curDir];
          setRobotPos({ x: curX, y: curY, dir: curDir });
          setRunLog((prev) => [...prev, `[LOGIKA JIKA]: Mendeteksi batu di depan, robot berbelok ke ${curDir}!`]);
        } else {
          setRunLog((prev) => [...prev, `[LOGIKA JIKA]: Jalur depan aman, tidak perlu berbelok.`]);
        }
      }
    }

    setIsExecuting(false);
    setActiveExecIdx(null);

    if (hitObstacle) {
      setMazeResult('hit_obstacle');
      playError();
    } else if (curX === currentLevel.goalPos.x && curY === currentLevel.goalPos.y && collected) {
      setMazeResult('success');
      playFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setRunLog((prev) => [...prev, `[FINISH]: 🏁 Selamat! Robot mencapai tujuan akhir dan membawa bintang!`]);
    } else if (curX === currentLevel.goalPos.x && curY === currentLevel.goalPos.y && !collected) {
      setMazeResult('failed');
      playError();
      setRunLog((prev) => [...prev, `[GAGAL]: Robot mencapai finish tetapi lupa mengambil bintang ⭐!`]);
    } else {
      setMazeResult('failed');
      playError();
      setRunLog((prev) => [...prev, `[GAGAL]: Robot berhenti di (${curX}, ${curY}) sebelum mencapai finish (${currentLevel.goalPos.x}, ${currentLevel.goalPos.y}).`]);
    }
  };

  // =========================================================================
  // BAGIAN 2: STUDIO MEMBUAT PROGRAM SEDERHANA SISWA (INTERAKTIF CODE RUNNER)
  // =========================================================================

  type ProgramPreset = 'kalkulator-nilai' | 'lampu-lalulintas' | 'perulangan-cetak' | 'beasiswa-prestasi';

  const [activePreset, setActivePreset] = useState<ProgramPreset>('kalkulator-nilai');

  // State untuk parameter masukan (Input Program)
  const [inputNilai, setInputNilai] = useState<number>(85);
  const [inputKehadiran, setInputKehadiran] = useState<number>(95);
  const [inputLampu, setInputLampu] = useState<'Merah' | 'Kuning' | 'Hijau'>('Merah');
  const [inputLoopCount, setInputLoopCount] = useState<number>(5);

  // State hasil eksekusi program
  const [programOutput, setProgramOutput] = useState<{
    status: string;
    variables: Record<string, any>;
    consoleLogs: string[];
    explanation: string;
  } | null>(null);

  const handleRunSimpleProgram = () => {
    playClick();

    if (activePreset === 'kalkulator-nilai') {
      const kkm = 75;
      const lulus = inputNilai >= kkm;
      const predikat = inputNilai >= 90 ? 'A (Sangat Baik)' : inputNilai >= 80 ? 'B (Baik)' : inputNilai >= 75 ? 'C (Cukup)' : 'D (Perlu Bimbingan)';

      setProgramOutput({
        status: lulus ? 'SUKSES: Tuntas' : 'EVALUASI: Belum Tuntas',
        variables: {
          nilai_siswa: inputNilai,
          kkm: 75,
          status_lulus: lulus,
          predikat
        },
        consoleLogs: [
          `>>> Membaca Input: nilai = ${inputNilai}`,
          `>>> Evaluasi Logika: JIKA nilai (${inputNilai}) >= 75`,
          `>>> Hasil Kondisi: ${lulus ? 'BENAR (TRUE)' : 'SALAH (FALSE)'}`,
          `>>> OUTPUT CETAK: Status = "${lulus ? 'LULUS KOMPETENSI' : 'REMEDIAL'}" | Predikat = "${predikat}"`
        ],
        explanation: 'Program ini menerapkan struktur kendali Percabangan (Branching IF-ELSE) untuk menentukan kelulusan siswa berdasarkan nilai batas minimal KKM.'
      });
      if (lulus) {
        playSuccess();
      } else {
        playClick();
      }
    } else if (activePreset === 'beasiswa-prestasi') {
      const dapatBeasiswa = inputNilai >= 85 && inputKehadiran >= 90;

      setProgramOutput({
        status: dapatBeasiswa ? 'SELAMAT: Lolos Beasiswa' : 'INFO: Belum Memenuhi Syarat',
        variables: {
          nilai_akademik: inputNilai,
          persentase_kehadiran: `${inputKehadiran}%`,
          operator_logika: 'AND (DAN)',
          lolos_seleksi: dapatBeasiswa
        },
        consoleLogs: [
          `>>> Input 1: nilai = ${inputNilai} (Syarat >= 85: ${inputNilai >= 85 ? 'YA' : 'TIDAK'})`,
          `>>> Input 2: kehadiran = ${inputKehadiran}% (Syarat >= 90%: ${inputKehadiran >= 90 ? 'YA' : 'TIDAK'})`,
          `>>> Evaluasi Logika Kombinasi: (nilai >= 85) AND (kehadiran >= 90)`,
          `>>> HASIL KEPUTUSAN: ${dapatBeasiswa ? 'MEMENUHI SYARAT BEASISWA PRESTASI SMPN 5 KROYA 🎓' : 'TIDAK MEMENUHI SYARAT (Harus memenuhi kedua kriteria sekaligus)'}`
        ],
        explanation: 'Program ini menggunakan Operator Logika Gabungan AND (DAN). Kedua kondisi nilai dan kehadiran harus sama-sama bernilai BENAR.'
      });
      if (dapatBeasiswa) {
        playFanfare();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } else {
        playClick();
      }
    } else if (activePreset === 'lampu-lalulintas') {
      let aksi = '';
      if (inputLampu === 'Merah') aksi = 'BERHENTI! Semua kendaraan wajib berhenti di belakang garis marka.';
      else if (inputLampu === 'Kuning') aksi = 'HATI-HATI! Kurangi kecepatan dan bersiap untuk berhenti.';
      else aksi = 'JALAN! Kendaraan dipersilakan melaju dengan tertib dan waspada.';

      setProgramOutput({
        status: `LAMPU: ${inputLampu.toUpperCase()}`,
        variables: {
          warna_sensor: inputLampu,
          instruksi_pengendara: aksi
        },
        consoleLogs: [
          `>>> Membaca status sensor kamera: warna = "${inputLampu}"`,
          `>>> Switch Case Logic: CASE ("${inputLampu}")`,
          `>>> KELUARAN SISTEM IOT: "${aksi}"`
        ],
        explanation: 'Program otomasi lampu pengatur lalu lintas menggunakan struktur percabangan majemuk (Multiple IF / Switch Case).'
      });
      playSuccess();
    } else if (activePreset === 'perulangan-cetak') {
      const logs: string[] = [];
      for (let i = 1; i <= inputLoopCount; i++) {
        logs.push(`Putaran ${i}: Robot Informatika mencetak teks ke-${i} [Nilai Counter i = ${i}]`);
      }
      logs.push(`>>> PERULANGAN SELESAI: Total iterasi berhasil dieksekusi sebanyak ${inputLoopCount} kali.`);

      setProgramOutput({
        status: `LOOP FOR BERHASIL (${inputLoopCount} Putaran)`,
        variables: {
          batas_maksimal: inputLoopCount,
          total_iterasi: inputLoopCount,
          status_loop: 'SELESAI'
        },
        consoleLogs: logs,
        explanation: 'Program ini mendemonstrasikan Struktur Perulangan (Looping FOR) di mana komputer dapat mengulang pekerjaan yang sama ribuan kali tanpa rasa lelah.'
      });
      playSuccess();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Simulation Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-purple-700 via-indigo-600 to-sky-700 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200">
          <Code2 className="w-4 h-4 text-purple-200" />
          <span>Laboratorium Coding & Algoritma Informatika Kelas 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Studio Pemrograman Siswa: Pseudocode, Algoritma & Runner Program
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
          Rancang pseudocode terstruktur, susun alur logika algoritma untuk memandu robot, dan jalankan program sederhana interaktif untuk menguji pemahaman konsep pemrograman!
        </p>
      </div>

      {/* Mode Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              playClick();
              setActiveSubMode('pseudocode-maze');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubMode === 'pseudocode-maze'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Rancang Pseudocode & Labirin Robot</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveSubMode('simple-program');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeSubMode === 'simple-program'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>2. Buat & Uji Program Sederhana</span>
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Ramah Layar Sentuh & Komputer Lab</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MODE 1: RANCANG PSEUDOCODE & ALGORITMA LABIRIN ROBOT                  */}
      {/* ========================================================================= */}
      {activeSubMode === 'pseudocode-maze' && (
        <div className="space-y-6">
          {/* Level Switcher */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pilih Misi Algoritma:
              </span>
              <div className="flex gap-2">
                {levels.map((lvl, idx) => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      playClick();
                      setCurrentLevelIdx(idx);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      currentLevelIdx === idx
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Misi {lvl.id}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-medium text-slate-500 italic hidden sm:inline">
              Petunjuk: {currentLevel.hint}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kolom Kiri: Arena Grid Visual 4x4 */}
            <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{currentLevel.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mulai di (0,0) menghadap {robotPos.dir}. Ambil Bintang ⭐ lalu tuju Finish 🏁!
                  </p>
                </div>

                <button
                  onClick={resetMazeArena}
                  disabled={isExecuting}
                  className="p-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Arena</span>
                </button>
              </div>

              {/* Grid 4x4 */}
              <div className="grid grid-cols-4 gap-2.5 max-w-[340px] sm:max-w-[380px] mx-auto p-3.5 rounded-3xl bg-slate-100 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-slate-800">
                {[0, 1, 2, 3].map((y) =>
                  [0, 1, 2, 3].map((x) => {
                    const isRobot = robotPos.x === x && robotPos.y === y;
                    const isStar = currentLevel.starPos.x === x && currentLevel.starPos.y === y && !starCollected;
                    const isGoal = currentLevel.goalPos.x === x && currentLevel.goalPos.y === y;
                    const isObstacle = currentLevel.obstaclePos && currentLevel.obstaclePos.x === x && currentLevel.obstaclePos.y === y;
                    const isStart = x === 0 && y === 0;

                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 border ${
                          isRobot
                            ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-400 shadow-sm'
                            : isObstacle
                            ? 'bg-stone-300 dark:bg-stone-800 border-stone-400 dark:border-stone-700'
                            : isGoal
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400'
                            : isStar
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {/* Koordinat Cell */}
                        <span className="absolute top-1 left-1.5 text-[9px] font-mono text-slate-400">
                          {x},{y}
                        </span>

                        {/* Rintangan Batu */}
                        {isObstacle && !isRobot && (
                          <div className="text-center animate-pulse">
                            <span className="text-xl">🪨</span>
                            <span className="text-[8px] font-bold text-stone-600 dark:text-stone-300 block">BATU</span>
                          </div>
                        )}

                        {/* Bintang */}
                        {isStar && !isRobot && (
                          <div className="text-center animate-bounce">
                            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                            <span className="text-[8px] font-bold text-amber-700 dark:text-amber-300 block">BINTANG</span>
                          </div>
                        )}

                        {/* Finish Flag */}
                        {isGoal && !isRobot && (
                          <div className="text-center">
                            <Flag className="w-6 h-6 text-emerald-600 fill-emerald-500" />
                            <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-300 block">FINISH</span>
                          </div>
                        )}

                        {/* Karakter Robot */}
                        {isRobot && (
                          <div className="flex flex-col items-center justify-center scale-105 animate-in fade-in zoom-in duration-200">
                            <div className="relative">
                              <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                              {/* Arrow Arah Hadap Robot */}
                              <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold shadow-xs"
                                style={{
                                  transform:
                                    robotPos.dir === 'E'
                                      ? 'rotate(0deg)'
                                      : robotPos.dir === 'S'
                                      ? 'rotate(90deg)'
                                      : robotPos.dir === 'W'
                                      ? 'rotate(180deg)'
                                      : 'rotate(270deg)'
                                }}
                              >
                                ▶
                              </div>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                              {robotPos.dir}
                            </span>
                          </div>
                        )}

                        {isStart && !isRobot && !isObstacle && !isStar && !isGoal && (
                          <span className="text-[9px] font-bold text-slate-400">MULAI</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Status Hasil Simulasi Labirin */}
              {mazeResult === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-1 animate-in fade-in">
                  <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Algoritma Sempurna! Robot Berhasil Mengambil Bintang & Tiba di Finish!</span>
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Pseudocode yang kamu rancang berhasil dieksekusi secara berurutan dan bebas dari bug.
                  </p>
                </div>
              )}

              {mazeResult === 'hit_obstacle' && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-center text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Robot menabrak rintangan batu! Perbaiki algoritma agar berbelok menghindari rintangan.</span>
                </div>
              )}

              {mazeResult === 'failed' && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-center text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Algoritma belum mencapai target akhir. Cek kembali urutan langkah pseudocode di sebelah kanan!</span>
                </div>
              )}

              {/* Terminal Log Eksekusi */}
              <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terminal Interpreter Pseudocode:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Live Engine</span>
                </div>
                <div className="font-mono text-[11px] space-y-1 max-h-24 overflow-y-auto">
                  {runLog.length === 0 ? (
                    <span className="text-slate-500 italic">Tekan "Jalankan Algoritma" untuk melihat pembacaan instruksi...</span>
                  ) : (
                    runLog.map((log, i) => (
                      <div key={i} className="text-emerald-400">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Penyusun Pseudocode & Algoritma (Editor) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Bank Instruksi Cepat */}
              <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tambahkan Instruksi Pseudocode:</span>
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold">
                    {studentProgram.length} / 12 Blok
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {availableInstructions.map((inst, i) => (
                    <button
                      key={i}
                      disabled={isExecuting || studentProgram.length >= 12}
                      onClick={() => handleAddInstruction(inst)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 text-left transition-all flex items-center justify-between text-xs disabled:opacity-40"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          + {inst.label}
                        </span>
                        <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 block">
                          {inst.pseudocode}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold shrink-0">
                        {inst.flowchart}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tumpukan Program Pseudocode Siswa */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                      Struktur Algoritma Sekuensial:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Instruksi akan dibaca komputer dari atas ke bawah
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      playClick();
                      setStudentProgram([]);
                    }}
                    disabled={isExecuting || studentProgram.length === 0}
                    className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold"
                  >
                    Kosongkan
                  </button>
                </div>

                {/* List of blocks */}
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {studentProgram.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      Belum ada instruksi. Klik tombol di atas untuk menambahkan langkah algoritma!
                    </div>
                  ) : (
                    studentProgram.map((block, idx) => {
                      const isCurrent = activeExecIdx === idx;

                      return (
                        <div
                          key={block.id}
                          className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 shadow-md ring-2 ring-purple-400'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-xs block truncate">{block.label}</span>
                              <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 block truncate">
                                {block.pseudocode}
                              </span>
                            </div>
                          </div>

                          {/* Tombol Reorder & Delete */}
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              disabled={isExecuting || idx === 0}
                              onClick={() => handleMoveInstruction(idx, 'up')}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                              title="Pindah ke Atas"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isExecuting || idx === studentProgram.length - 1}
                              onClick={() => handleMoveInstruction(idx, 'down')}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                              title="Pindah ke Bawah"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isExecuting}
                              onClick={() => handleRemoveInstruction(idx)}
                              className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-500"
                              title="Hapus Baris"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Eksekusi Action */}
                <div className="pt-2">
                  <button
                    onClick={handleExecuteAlgorithm}
                    disabled={isExecuting || studentProgram.length === 0}
                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isExecuting ? 'Mengeksekusi Algoritma...' : 'Jalankan Pseudocode Algoritma ▶'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODE 2: STUDIO PROGRAM SEDERHANA SISWA (INTERAKTIF CODE RUNNER)       */}
      {/* ========================================================================= */}
      {activeSubMode === 'simple-program' && (
        <div className="space-y-6">
          {/* Preset Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'kalkulator-nilai', title: '1. Logika Nilai & KKM', desc: 'Percabangan IF-ELSE kelulusan', icon: SlidersHorizontal },
              { id: 'beasiswa-prestasi', title: '2. Seleksi Beasiswa', desc: 'Operator Logika AND (Nilai & Kehadiran)', icon: Award },
              { id: 'lampu-lalulintas', title: '3. Lampu Lalu Lintas IoT', desc: 'Percabangan Majemuk / Switch Case', icon: Zap },
              { id: 'perulangan-cetak', title: '4. Perulangan Cetak (Loop)', desc: 'Struktur Iterasi FOR Counter', icon: Layers }
            ].map((p) => {
              const Icon = p.icon;
              const isActive = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    playClick();
                    setActivePreset(p.id as ProgramPreset);
                    setProgramOutput(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/50 shadow-md ring-1 ring-purple-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{p.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kolom Kiri: Input & Kode Sumber Sederhana */}
            <div className="lg:col-span-6 space-y-4">
              {/* Input Parameters Box */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                    <span>Ubah Nilai Variabel Input (Parameter Program):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Uji Berbagai Kemungkinan</span>
                </div>

                {/* Input Controls Based on Preset */}
                {activePreset === 'kalkulator-nilai' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Nilai Ujian Informatika:</span>
                        <span className="font-bold font-mono text-purple-600">{inputNilai} Poin</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={inputNilai}
                        onChange={(e) => setInputNilai(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>40 (Di Bawah KKM)</span>
                        <span className="font-bold text-slate-600 dark:text-slate-300">KKM = 75</span>
                        <span>100 (Sempurna)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePreset === 'beasiswa-prestasi' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Nilai Rata-Rata Akademik (Syarat &gt;= 85):</span>
                        <span className="font-bold font-mono text-purple-600">{inputNilai} Poin</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="100"
                        value={inputNilai}
                        onChange={(e) => setInputNilai(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Persentase Kehadiran Kelas (Syarat &gt;= 90%):</span>
                        <span className="font-bold font-mono text-purple-600">{inputKehadiran}%</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="100"
                        value={inputKehadiran}
                        onChange={(e) => setInputKehadiran(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>
                )}

                {activePreset === 'lampu-lalulintas' && (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Pilih Warna Lampu Lalu Lintas yang Terdeteksi Sensor:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Merah', 'Kuning', 'Hijau'] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => setInputLampu(w)}
                          className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                            inputLampu === w
                              ? w === 'Merah'
                                ? 'bg-red-500 text-white border-red-600 shadow-md'
                                : w === 'Kuning'
                                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md'
                                : 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          Lampu {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activePreset === 'perulangan-cetak' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Jumlah Perulangan (Counter Loop N):</span>
                      <span className="font-bold font-mono text-purple-600">{inputLoopCount} Kali</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={inputLoopCount}
                      onChange={(e) => setInputLoopCount(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>1 Kali</span>
                      <span>5 Kali</span>
                      <span>10 Kali</span>
                    </div>
                  </div>
                )}

                {/* Tombol Eksekusi Program */}
                <button
                  onClick={handleRunSimpleProgram}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Kompilasi & Jalankan Program Siswa ▶</span>
                </button>
              </div>

              {/* Source Code View Box (Python / Pseudocode Representatif) */}
              <div className="p-4 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 font-mono text-xs space-y-2 shadow-md">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Kode Program Sumber (Python / Pseudocode):</span>
                  </span>
                  <span className="text-[10px] text-slate-500">source.py</span>
                </div>

                <pre className="p-3 bg-slate-900 rounded-xl overflow-x-auto text-[11px] leading-relaxed text-sky-300">
                  {activePreset === 'kalkulator-nilai' &&
`# PROGRAM KELULUSAN SISWA SMPN 5 KROYA
kkm = 75
nilai = ${inputNilai}

if nilai >= kkm:
    status = "LULUS KOMPETENSI"
    if nilai >= 90:
        predikat = "A (Sangat Baik)"
    elif nilai >= 80:
        predikat = "B (Baik)"
    else:
        predikat = "C (Cukup)"
else:
    status = "REMEDIAL"
    predikat = "D (Perlu Bimbingan)"

print(f"Status: {status} | Predikat: {predikat}")`}

                  {activePreset === 'beasiswa-prestasi' &&
`# PROGRAM SELEKSI BEASISWA DENGAN OPERATOR AND
nilai_akademik = ${inputNilai}
kehadiran = ${inputKehadiran}

# Kedua syarat wajib terpenuhi bersamaan
if nilai_akademik >= 85 and kehadiran >= 90:
    hasil = "MEMENUHI SYARAT BEASISWA"
else:
    hasil = "TIDAK MEMENUHI SYARAT"

print(hasil)`}

                  {activePreset === 'lampu-lalulintas' &&
`# PROGRAM KONTROL LAMPU LALU LINTAS CERDAS
sensor_warna = "${inputLampu}"

if sensor_warna == "Merah":
    tindakan = "BERHENTI SEPENUHNYA"
elif sensor_warna == "Kuning":
    tindakan = "HATI-HATI & KURANGI KECEPATAN"
elif sensor_warna == "Hijau":
    tindakan = "SILAKAN MELAJU TERTIB"

print(f"Instruksi Kendaraan: {tindakan}")`}

                  {activePreset === 'perulangan-cetak' &&
`# PROGRAM PERULANGAN FOR DENGAN COUNTER
jumlah_cetak = ${inputLoopCount}

for i in range(1, jumlah_cetak + 1):
    print(f"Robot mencetak pesan ke-{i}")

print("Perulangan Selesai!")`}
                </pre>
              </div>
            </div>

            {/* Kolom Kanan: Hasil Keluaran Eksekusi & Inspeksi Memori Variabel */}
            <div className="lg:col-span-6 space-y-4">
              {/* Konsol Output */}
              <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Layar Konsol Output Eksekusi:</span>
                  </span>
                  {programOutput && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Eksekusi Selesai
                    </span>
                  )}
                </div>

                {programOutput ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-1.5 border border-slate-800">
                      {programOutput.consoleLogs.map((log, i) => (
                        <div key={i} className="text-emerald-400">
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Inspeksi Nilai Variabel di Memori */}
                    <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-2">
                      <span className="text-[11px] font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider block">
                        📊 Inspeksi Nilai Variabel di Memori Komputer:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {Object.entries(programOutput.variables).map(([key, val]) => (
                          <div key={key} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/60">
                            <span className="text-slate-400 block text-[10px]">{key}:</span>
                            <span className="font-bold text-purple-700 dark:text-purple-300">
                              {String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Penjelasan Konsep Informatika */}
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-normal">{programOutput.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <Terminal className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                    <p>Ubah nilai variabel di sebelah kiri, lalu tekan tombol <strong>"Kompilasi & Jalankan Program Siswa"</strong> untuk melihat hasil eksekusi program!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
