import React, { useState } from 'react';
import { Topic, StudentProgress } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import { getTopicGamePack } from '../../data/interactiveGamesData';
import confetti from 'canvas-confetti';
import {
  Sliders,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Award,
  Layers,
  Hand,
  Maximize2,
  Minimize2,
  Building2,
  AlertOctagon,
  School,
  MessageSquareWarning,
  BookOpenCheck,
  SmartphoneNfc,
  Split,
  Repeat,
  MapPin,
  Power,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  Cpu,
  HardDrive,
  Monitor,
  Keyboard,
  Printer,
  Wifi,
  Radio,
  Code2,
  Terminal,
  Lock,
  Search,
  FileText,
  Globe,
  Zap
} from 'lucide-react';

// Specialized Dedicated Topic Simulations
import { SpreadsheetSimulation } from './simulations/SpreadsheetSimulation';
import { NetworkTopologySimulation } from './simulations/NetworkTopologySimulation';
import { CodeMazeSimulation } from './simulations/CodeMazeSimulation';
import { CredibilityFactScanner } from './simulations/CredibilityFactScanner';
import { CyberSecuritySimulation } from './simulations/CyberSecuritySimulation';
import { ComputerIPOSimulation } from './simulations/ComputerIPOSimulation';
import { SearchEngineSimulation } from './simulations/SearchEngineSimulation';
import { ScenarioChallengeSimulation } from './simulations/ScenarioChallengeSimulation';

interface SimulasiViewProps {
  topic: Topic;
  progress: StudentProgress;
  onSaveResult: (score: number) => void;
  onNext: () => void;
  onBackToDashboard: () => void;
}

export const SimulasiView: React.FC<SimulasiViewProps> = ({
  topic,
  progress,
  onSaveResult,
  onNext,
  onBackToDashboard
}) => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();
  const sim = topic.simulasi;
  const gamePack = getTopicGamePack(topic.id, topic.title, topic.grade);

  // 4 Pilihan Ragam Aktivitas Simulasi
  // 'utama' | 'klasifikasi' | 'tebak-gambar' | 'kasus-nyata'
  const [activeSimTab, setActiveSimTab] = useState<'utama' | 'klasifikasi' | 'tebak-gambar' | 'kasus-nyata'>('utama');

  // IFP Fullscreen Mode
  const [isIfpFullscreen, setIsIfpFullscreen] = useState(false);

  // ==========================================
  // STATE KLASIFIKASI VISUAL (IFP TOUCH)
  // ==========================================
  const cards = gamePack.visualSimulationCards;
  const categories = gamePack.simulationCategories;

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [score, setScore] = useState(0);

  // Dynamic icon helper
  const renderCardIcon = (iconType: string) => {
    const props = { className: 'w-7 h-7 sm:w-8 sm:h-8 shrink-0' };
    switch (iconType) {
      case 'Building2': return <Building2 {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />;
      case 'AlertOctagon': return <AlertOctagon {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-rose-600" />;
      case 'School': return <School {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />;
      case 'MessageSquareWarning': return <MessageSquareWarning {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />;
      case 'BookOpenCheck': return <BookOpenCheck {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />;
      case 'SmartphoneNfc': return <SmartphoneNfc {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />;
      case 'Split': return <Split {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />;
      case 'Repeat': return <Repeat {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />;
      case 'MapPin': return <MapPin {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />;
      case 'Power': return <Power {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />;
      case 'ShieldCheck': return <ShieldCheck {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />;
      case 'AlertTriangle': return <AlertTriangle {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />;
      case 'Cpu': return <Cpu {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />;
      case 'HardDrive': return <HardDrive {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600" />;
      case 'Monitor': return <Monitor {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />;
      case 'Keyboard': return <Keyboard {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />;
      case 'Printer': return <Printer {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />;
      case 'Wifi': return <Wifi {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600" />;
      case 'Radio': return <Radio {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />;
      case 'Code2': return <Code2 {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />;
      case 'Terminal': return <Terminal {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700 dark:text-slate-300" />;
      case 'Lock': return <Lock {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />;
      case 'Search': return <Search {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" />;
      case 'FileSpreadsheet': return <FileSpreadsheet {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />;
      case 'FileText': return <FileText {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />;
      default: return <Lightbulb {...props} className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />;
    }
  };

  const handleSelectCard = (id: string) => {
    playClick();
    setSelectedCardId(id === selectedCardId ? null : id);
  };

  const handleAssignToCategory = (cat: string) => {
    if (!selectedCardId) return;
    playClick();
    setPlacements((prev) => ({
      ...prev,
      [selectedCardId]: cat
    }));
    setSelectedCardId(null);
    setIsEvaluated(false);
  };

  const handleDirectAssign = (cardId: string, cat: string) => {
    playClick();
    setPlacements((prev) => ({
      ...prev,
      [cardId]: cat
    }));
    setIsEvaluated(false);
  };

  const handleEvaluate = () => {
    playClick();
    let correctCount = 0;
    cards.forEach((card) => {
      if (placements[card.id] === card.correctCategory) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / cards.length) * 100);
    setScore(calculatedScore);
    setIsEvaluated(true);

    if (calculatedScore >= 80) {
      playFanfare();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } else {
      playSuccess();
    }

    onSaveResult(calculatedScore);
  };

  const handleResetKlasifikasi = () => {
    playClick();
    setPlacements({});
    setSelectedCardId(null);
    setIsEvaluated(false);
    setScore(0);
  };

  // ==========================================
  // STATE TEBAK & INSPEKSI GAMBAR VISUAL
  // ==========================================
  const [inspectCardIdx, setInspectCardIdx] = useState(0);
  const [inspectAnswered, setInspectAnswered] = useState<Record<number, string>>({});

  const handleInspectAnswer = (cat: string) => {
    playClick();
    setInspectAnswered((prev) => ({
      ...prev,
      [inspectCardIdx]: cat
    }));

    const card = cards[inspectCardIdx];
    if (cat === card.correctCategory) {
      playSuccess();
    } else {
      playError();
    }
  };

  // Helper router for Mode 1: Lab Utama Khusus Topik
  const renderDedicatedTopicSimulation = () => {
    const t = topic.title.toLowerCase();
    const type = sim?.type;

    if (t.includes('excel') || t.includes('spreadsheet') || t.includes('lembar kerja') || type === 'formula-tester') {
      return <SpreadsheetSimulation topicTitle={topic.title} />;
    }
    if (t.includes('jaringan') || t.includes('lan') || t.includes('topologi') || type === 'network-connector') {
      return <NetworkTopologySimulation />;
    }
    if (t.includes('pemrograman') || t.includes('coding') || t.includes('algoritma game') || type === 'code-builder') {
      return <CodeMazeSimulation />;
    }
    if (t.includes('informasi digital') || t.includes('kredibilitas') || t.includes('fakta') || t.includes('hoaks') || type === 'fact-checker') {
      return <CredibilityFactScanner />;
    }
    if (t.includes('keamanan') || t.includes('siber') || t.includes('password') || type === 'cyber-security') {
      return <CyberSecuritySimulation />;
    }
    if (t.includes('komputer') || t.includes('hardware') || t.includes('perangkat keras') || topic.id === 'k7-komputer') {
      return <ComputerIPOSimulation />;
    }
    if (t.includes('browser') || t.includes('search') || t.includes('mesin pencari') || topic.id === 'k7-bse') {
      return <SearchEngineSimulation />;
    }

    // Default to the rich Categorize simulation directly built with topic.simulasi data
    return (
      <div className="space-y-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-emerald-600 to-teal-700 text-white shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
            <Sliders className="w-4 h-4" />
            <span>Laboratorium Khusus Materi: {topic.title}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">{sim.title}</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            {sim.scenario}
          </p>
        </div>

        {/* Petunjuk Interaktif */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white block mb-0.5 font-bold">
            Instruksi Lab:
          </strong>
          {sim.instructions}
        </div>

        {/* Klasifikasi Kasus Nyata Materi */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {Object.keys(placements).length} dari {cards.length} Kasus Terkelompokkan
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetKlasifikasi}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100"
              >
                Reset
              </button>
              <button
                onClick={handleEvaluate}
                disabled={Object.keys(placements).length === 0}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Periksa Jawaban</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const assignedCards = cards.filter((c) => placements[c.id] === cat);

              return (
                <div
                  key={cat}
                  onClick={() => handleAssignToCategory(cat)}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer min-h-[160px] flex flex-col justify-between ${
                    selectedCardId
                      ? 'border-dashed border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-4 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{cat}</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {assignedCards.length} Kartu
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2.5">
                      {assignedCards.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">
                          {selectedCardId ? '👉 Sentuh untuk menempatkan kartu' : 'Keranjang kosong'}
                        </p>
                      ) : (
                        assignedCards.map((c) => (
                          <div
                            key={c.id}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold flex items-center justify-between"
                          >
                            <span className="truncate">{c.title}</span>
                            {isEvaluated && (
                              <span>
                                {c.correctCategory === cat ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <X className="w-3.5 h-3.5 text-rose-600" />
                                )}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {selectedCardId && (
                    <div className="pt-2 text-center">
                      <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold">
                        + Tempatkan di Sini
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cards Palette */}
          <div className="space-y-3 pt-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Daftar Kartu Kasus (Sentuh Kartu, lalu Pilih Kategori):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cards.map((card) => {
                const isSelected = selectedCardId === card.id;
                const assignedCat = placements[card.id];

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 active:scale-95 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 ring-4 ring-emerald-500/30'
                        : assignedCat
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border shrink-0">
                        {renderCardIcon(card.iconType)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                          {card.title}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDirectAssign(card.id, cat);
                          }}
                          className={`px-2 py-0.5 text-[10px] rounded-md font-semibold transition-all ${
                            assignedCat === cat
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
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

  return (
    <div
      className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200 ${
        isIfpFullscreen ? 'fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto max-w-none p-6' : ''
      }`}
    >
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            playClick();
            onBackToDashboard();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Materi</span>
        </button>

        <div className="flex items-center gap-2">
          {/* IFP Screen Toggle */}
          <button
            onClick={() => setIsIfpFullscreen(!isIfpFullscreen)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            title="Layar Penuh untuk IFP / Proyektor"
          >
            {isIfpFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isIfpFullscreen ? 'Keluar Layar Penuh' : 'Mode IFP Layar Penuh'}</span>
          </button>

          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Modul 4 dari 8 · Simulasi Visual
          </span>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Laboratorium Interaktif & Simulasi Khusus Topik</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Simulasi: {topic.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Dirancang 100% sesuai materi pilihanmu · Dilengkapi beragam pilihan aktivitas interaktif multi-touch untuk Layar Sentuh IFP & Laptop
        </p>
      </div>

      {/* 4 PILIHAN RAGAM AKTIVITAS SIMULASI (ACTIVITY HUB SELECTOR) */}
      <div className="p-1.5 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          <button
            onClick={() => {
              playClick();
              setActiveSimTab('utama');
            }}
            className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeSimTab === 'utama'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Lab Utama Materi</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveSimTab('klasifikasi');
            }}
            className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeSimTab === 'klasifikasi'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Klasifikasi IFP</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveSimTab('tebak-gambar');
            }}
            className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeSimTab === 'tebak-gambar'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Detektif Visual</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveSimTab('kasus-nyata');
            }}
            className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeSimTab === 'kasus-nyata'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <School className="w-4 h-4 shrink-0" />
            <span className="truncate">4. Kasus Sehari-Hari</span>
          </button>
        </div>
      </div>

      {/* Petunjuk Multi-Touch IFP Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
        <Hand className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
            Petunjuk Penggunaan Layar Sentuh (IFP / Touchscreen Multi-Touch):
          </strong>
          Sentuh elemen visual interaktif di bawah ini untuk bereksperimen. Di layar sentuh IFP kelas, beberapa siswa dapat menyentuh tombol simulasi secara bersamaan (*multi-touch*).
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB AKTIVITAS 1: LAB UTAMA MATERI                                      */}
      {/* ========================================================================= */}
      {activeSimTab === 'utama' && (
        <div className="animate-in fade-in duration-300">
          {renderDedicatedTopicSimulation()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB AKTIVITAS 2: KLASIFIKASI KARTU BERGAMBAR MULTI-TOUCH IFP          */}
      {/* ========================================================================= */}
      {activeSimTab === 'klasifikasi' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Tools Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {Object.keys(placements).length} dari {cards.length} Kartu Kasus Terkelompokkan
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetKlasifikasi}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleEvaluate}
                disabled={Object.keys(placements).length === 0}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Periksa Klasifikasi</span>
              </button>
            </div>
          </div>

          {/* KERANJANG KATEGORI TUJUAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const assignedCards = cards.filter((c) => placements[c.id] === cat);

              return (
                <div
                  key={cat}
                  onClick={() => handleAssignToCategory(cat)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer min-h-[160px] flex flex-col justify-between ${
                    selectedCardId
                      ? 'border-dashed border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-4 ring-emerald-500/20 animate-pulse'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span>{cat}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                        {assignedCards.length} Kartu
                      </span>
                    </div>

                    <div className="space-y-2 pt-3">
                      {assignedCards.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">
                          {selectedCardId ? '👉 Sentuh di sini untuk memasukkan kartu terpilih!' : 'Keranjang masih kosong'}
                        </p>
                      ) : (
                        assignedCards.map((c) => {
                          const isCorrect = c.correctCategory === cat;

                          return (
                            <div
                              key={c.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                                isEvaluated
                                  ? isCorrect
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold'
                                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {renderCardIcon(c.iconType)}
                                <span className="truncate">{c.title}</span>
                              </div>

                              {isEvaluated && (
                                <span className="shrink-0 font-bold">
                                  {isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {selectedCardId && (
                    <div className="pt-3 text-center">
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs">
                        + Tempatkan di Sini
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DAFTAR KARTU BERGAMBAR INTERAKTIF */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daftar Kartu Kasus Khusus Materi (Sentuh Kartu, lalu Pilih Kategori):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => {
                const isSelected = selectedCardId === card.id;
                const assignedCategory = placements[card.id];

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer space-y-3 shadow-sm select-none active:scale-98 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 ring-4 ring-emerald-500/30'
                        : assignedCategory
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-90'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                        {renderCardIcon(card.iconType)}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                          {card.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDirectAssign(card.id, cat);
                          }}
                          className={`px-2.5 py-1 text-[11px] rounded-lg border font-semibold transition-all ${
                            assignedCategory === cat
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Hasil Evaluasi */}
          {isEvaluated && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-3 animate-in fade-in">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {score} / 100 Poin
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto">
                {score === 100
                  ? 'Luar biasa! Seluruh kartu kasus nyata berhasil kamu pilah dengan sempurna sesuai prinsip materi ini.'
                  : score >= 60
                  ? 'Bagus sekali! Sebagian besar kartu sudah tepat. Perhatikan kartu bertanda merah dan coba pelajari kembali.'
                  : 'Tetap semangat! Periksa kembali materi pembelajaran dan coba ulangi klasifikasi ini.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB AKTIVITAS 3: TEBAK & INSPEKSI GAMBAR VISUAL                        */}
      {/* ========================================================================= */}
      {activeSimTab === 'tebak-gambar' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Kasus Gambar {inspectCardIdx + 1} dari {cards.length}
            </span>

            <div className="flex gap-2">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClick();
                    setInspectCardIdx(i);
                  }}
                  className={`w-7 h-7 rounded-xl font-bold text-xs transition-all ${
                    inspectCardIdx === i
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : inspectAnswered[i]
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                      : 'border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Inspektor Kartu Gambar */}
          {(() => {
            const currentCard = cards[inspectCardIdx];
            const answer = inspectAnswered[inspectCardIdx];
            const isCorrect = answer === currentCard.correctCategory;

            return (
              <div className="space-y-6 text-center max-w-xl mx-auto py-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border-4 border-emerald-400 flex items-center justify-center p-4 shadow-lg">
                  {renderCardIcon(currentCard.iconType)}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentCard.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {currentCard.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pilih Kategori yang Paling Tepat:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleInspectAnswer(cat)}
                        className={`px-5 py-3 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 ${
                          answer === cat
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-rose-500 bg-rose-500 text-white'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {answer && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in">
                    {isCorrect ? (
                      <span className="font-bold text-emerald-600">
                        🎉 Jawabanmu Tepat! Kasus ini tergolong ke dalam: {currentCard.correctCategory}.
                      </span>
                    ) : (
                      <span className="font-bold text-rose-600">
                        ❌ Belum tepat. Jawaban yang benar adalah: {currentCard.correctCategory}.
                      </span>
                    )}
                  </div>
                )}

                {/* Navigasi Kartu Berikutnya */}
                <div className="pt-2 flex justify-between">
                  <button
                    disabled={inspectCardIdx === 0}
                    onClick={() => {
                      playClick();
                      setInspectCardIdx((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2 border rounded-xl text-xs font-bold disabled:opacity-30"
                  >
                    &larr; Kasus Sebelumnya
                  </button>

                  <button
                    disabled={inspectCardIdx === cards.length - 1}
                    onClick={() => {
                      playClick();
                      setInspectCardIdx((prev) => Math.min(cards.length - 1, prev + 1));
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold disabled:opacity-30 flex items-center gap-1.5"
                  >
                    <span>Kasus Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB AKTIVITAS 4: SIMULASI KASUS NYATA SEKOLAH                           */}
      {/* ========================================================================= */}
      {activeSimTab === 'kasus-nyata' && (
        <div className="animate-in fade-in duration-300">
          <ScenarioChallengeSimulation topic={topic} />
        </div>
      )}

      {/* Bottom Nav Action */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => {
            playClick();
            onBackToDashboard();
          }}
          className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          Menu Materi
        </button>

        <button
          onClick={() => {
            playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-colors"
        >
          <span>Lanjut ke Mini Game Edukasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
