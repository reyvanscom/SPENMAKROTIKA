import React, { useState } from 'react';
import { Topic } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import { VisualMateriInfographic } from './VisualMateriInfographic';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Target,
  Lightbulb,
  Info,
  Sparkles,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Cpu,
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  Lock,
  Check,
  Globe,
  Smartphone,
  Laptop,
  Database,
  Zap,
  Share2,
  Play,
  Pause,
  Eye,
  Sliders,
  HelpCircle,
  ExternalLink,
  Users
} from 'lucide-react';

interface MateriViewProps {
  topic: Topic;
  onNext: () => void;
  onBackToDashboard: () => void;
}

export const MateriView: React.FC<MateriViewProps> = ({
  topic,
  onNext,
  onBackToDashboard
}) => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();
  const materi = topic.materi;
  const isDigitalInfo = topic.id === 'k7-idk';

  // Interactive Lab states for Concept 1 (Fisik vs Digital)
  const [digitalModeView, setDigitalModeView] = useState<'fisik' | 'digital'>('digital');

  // Interactive Lab states for Concept 3 (Jenis Informasi)
  const [activeFormatTab, setActiveFormatTab] = useState<'teks' | 'gambar' | 'audio' | 'video'>('teks');
  const [isPlayingAudioSim, setIsPlayingAudioSim] = useState(false);
  const [isPlayingVideoSim, setIsPlayingVideoSim] = useState(false);

  // Interactive Lab states for Concept 4 (Search Simulation)
  const [searchSimKeyword, setSearchSimKeyword] = useState<string>('tepat');

  // Interactive Lab states for Concept 5 (Fact Checker Checklist)
  const [checkedFactItems, setCheckedFactItems] = useState<Record<number, boolean>>({
    0: true,
    1: true
  });

  // Formative quiz state
  const [formativeAnswers, setFormativeAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleSelectFormative = (qIdx: number, optIdx: number) => {
    playClick();
    setFormativeAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));

    if (optIdx === materi.formativeCheck[qIdx].answerIndex) {
      playSuccess();
      // Check if all answered correctly
      const totalQ = materi.formativeCheck.length;
      const willBeAllCorrect = Object.keys(formativeAnswers).length + 1 >= totalQ;
      if (willBeAllCorrect) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        } catch (e) {}
      }
    } else {
      playError();
    }
  };

  const toggleFactCheck = (idx: number) => {
    playClick();
    setCheckedFactItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-200">
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
          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            Modul 3 dari 8 · Materi Visual Interaktif
          </span>
        </div>
      </div>

      {/* 1. HEADER & OVERVIEW */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Informatika Kurikulum Merdeka · Kelas {topic.grade}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {topic.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {materi.overview}
        </p>

        {/* Tujuan Pembelajaran Card with Visual Checks */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/80 to-indigo-50/60 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/80 dark:border-sky-900/60 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider">
            <Target className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Tujuan Pembelajaran (Learning Objectives):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800 dark:text-slate-200">
            {topic.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-sky-100 dark:border-sky-950 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="leading-relaxed font-medium">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. INFOGRAFIS VISUAL HERO (Foto & Diagram Peta Pembelajaran) */}
      <VisualMateriInfographic topic={topic} />

      {/* 3. PENJELASAN KONSEP UTAMA DENGAN VISUAL MENARIK */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Eksplorasi Konsep Interaktif
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Penjelasan 5 Konsep Utama Disertai Visual
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            Mendukung Sentuhan IFP
          </span>
        </div>

        {/* ======================================================== */}
        {/* KHUSUS: MATERI KELAS 7 INFORMASI DIGITAL (k7-idk)       */}
        {/* ======================================================== */}
        {isDigitalInfo ? (
          <div className="space-y-8">
            {/* KONSEP 1: Pengertian Informasi Digital */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-sky-200 dark:border-sky-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold text-xs">
                    Konsep 1
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    1. Pengertian Informasi Digital
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  <Smartphone className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {materi.keyConcepts[0]?.explanation}
              </p>

              {/* VISUAL SIMULASI INTERAKTIF: FISIK VS DIGITAL */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    🔬 Simulasi Visual: Kertas Fisik vs Data Digital
                  </span>
                  <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => { playClick(); setDigitalModeView('fisik'); }}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        digitalModeView === 'fisik'
                          ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-xs font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      Buku Fisik 📚
                    </button>
                    <button
                      onClick={() => { playClick(); setDigitalModeView('digital'); }}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        digitalModeView === 'digital'
                          ? 'bg-sky-600 text-white shadow-xs font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      Smartphone & Cloud 📱
                    </button>
                  </div>
                </div>

                {digitalModeView === 'fisik' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                    <div className="space-y-1">
                      <strong className="text-amber-800 dark:text-amber-300 block">📦 Ruang & Beban</strong>
                      <p className="text-slate-600 dark:text-slate-400">Memerlukan lemari besar dan tas sekolah yang berat jika membawa 10 buku.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-amber-800 dark:text-amber-300 block">⏳ Kecepatan Cari</strong>
                      <p className="text-slate-600 dark:text-slate-400">Harus membalik lembar per lembar secara manual satu per satu.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-amber-800 dark:text-amber-300 block">💧 Ketahanan</strong>
                      <p className="text-slate-600 dark:text-slate-400">Bisa sobek, basah terkena air hujan, atau hilang tercecer.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 text-xs">
                    <div className="space-y-1">
                      <strong className="text-sky-700 dark:text-sky-300 block">☁️ Ringan & Tak Terbatas</strong>
                      <p className="text-slate-600 dark:text-slate-300">1 HP ringan bisa memuat 50.000 buku digital tanpa menambah berat tas!</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-sky-700 dark:text-sky-300 block">⚡ Cari dalam 1 Detik</strong>
                      <p className="text-slate-600 dark:text-slate-300">Ketik kata kunci di fitur pencari, langsung ketemu seketika.</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-sky-700 dark:text-sky-300 block">🔒 Aman di Cloud</strong>
                      <p className="text-slate-600 dark:text-slate-300">Tersimpan di Google Drive, HP rusak file tetap aman bisa dibuka lagi.</p>
                    </div>
                  </div>
                )}

                {/* Animated Binary / Data Flow Visualization */}
                <div className="p-3 rounded-xl bg-slate-900 text-sky-400 font-mono text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
                  <span className="flex items-center gap-1.5 shrink-0 text-white font-sans font-bold">
                    <Database className="w-3.5 h-3.5 text-sky-400" />
                    Alur Bit Digital:
                  </span>
                  <span className="text-emerald-400 animate-pulse whitespace-nowrap">
                    01001001 01101110 01100110 01101111 01110010 01101101 01100001 01110011 01101001
                  </span>
                  <span className="text-xs font-sans text-sky-300 font-bold shrink-0">
                    &rarr; Tampil di Layar HP
                  </span>
                </div>
              </div>
            </div>

            {/* KONSEP 2: Manfaat Informasi Digital */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    Konsep 2
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    2. Manfaat Informasi Digital bagi Siswa SMP
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {materi.keyConcepts[1]?.explanation}
              </p>

              {/* 4 KARTU BERGAMBAR INFOGRAFIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/70 to-white dark:from-amber-950/30 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    ⚡
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Cepat & Praktis</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Jawaban tugas sekolah ditemukan dalam hitungan detik di mesin pencari.
                  </p>
                  <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full inline-block">
                    Hemat Waktu 95%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-50/70 to-white dark:from-sky-950/30 dark:to-slate-900 border border-sky-200 dark:border-sky-900/40 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    🌍
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">24/7 Di Mana Saja</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Belajar dari kamar, kelas, perpustakaan, atau saat perjalanan di bus.
                  </p>
                  <div className="text-[10px] font-bold text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-full inline-block">
                    Akses Kapan Saja
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-50/70 to-white dark:from-purple-950/30 dark:to-slate-900 border border-purple-200 dark:border-purple-900/40 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    🎨
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Media Variatif</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Materi dilengkapi video animasi, rekaman suara guru, dan infografis hidup.
                  </p>
                  <div className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full inline-block">
                    Tidak Membosankan
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    👥
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Kerja Kelompok</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Siswa menulis bersama di satu dokumen daring tanpa harus bertemu fisik.
                  </p>
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full inline-block">
                    Kolaborasi Online
                  </div>
                </div>
              </div>
            </div>

            {/* KONSEP 3: Jenis-Jenis Informasi Digital */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    Konsep 3
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    3. Jenis-Jenis Informasi Digital & Format File
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {materi.keyConcepts[2]?.explanation}
              </p>

              {/* INTERACTIVE MULTIMEDIA FORMAT LAB */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    🎛️ Laboratorium Format Interaktif (Sentuh untuk Memeriksa)
                  </span>
                </div>

                {/* Format Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => { playClick(); setActiveFormatTab('teks'); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      activeFormatTab === 'teks'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs">1. Teks</div>
                      <div className="text-[10px] text-slate-500 font-mono">.PDF .DOCX</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { playClick(); setActiveFormatTab('gambar'); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      activeFormatTab === 'gambar'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5 text-sky-600 shrink-0" />
                    <div>
                      <div className="text-xs">2. Gambar</div>
                      <div className="text-[10px] text-slate-500 font-mono">.PNG .JPG</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { playClick(); setActiveFormatTab('audio'); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      activeFormatTab === 'audio'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Headphones className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-xs">3. Audio</div>
                      <div className="text-[10px] text-slate-500 font-mono">.MP3 .WAV</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { playClick(); setActiveFormatTab('video'); }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      activeFormatTab === 'video'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Video className="w-5 h-5 text-purple-600 shrink-0" />
                    <div>
                      <div className="text-xs">4. Video</div>
                      <div className="text-[10px] text-slate-500 font-mono">.MP4 .WEBM</div>
                    </div>
                  </button>
                </div>

                {/* Active Tab Preview Simulator */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {activeFormatTab === 'teks' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Mockup Teks Digital: Modul Informatika SMPN 5 Kroya.pdf
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">
                          Format Dokumen
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 font-serif text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        <p className="font-bold text-slate-900 dark:text-white mb-1">Bab 3: Dunia Digital & Jaringan</p>
                        "Informasi digital tersusun dari kombinasi kode biner 0 dan 1 yang diproses dalam mikroprosesor. Karakteristik utamanya adalah dapat dicari dengan cepat melalui pintasan <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[10px]">Ctrl+F</kbd>."
                      </div>
                    </div>
                  )}

                  {activeFormatTab === 'gambar' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-sky-700 dark:text-sky-400">
                          Mockup Gambar & Infografis: Poster Alur Jaringan.png
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono">
                          Format Visual
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 space-y-1">
                          <strong className="text-sky-800 dark:text-sky-300 block">PNG (Portable Network Graphics)</strong>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px]">Mendukung latar belakang transparan, sangat pas untuk logo sekolah dan diagram tanpa buram.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                          <strong className="text-slate-800 dark:text-slate-300 block">JPG / JPEG</strong>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">Ukuran file kecil terkompresi, sangat pas untuk foto dokumentasi kegiatan sekolah di web.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFormatTab === 'audio' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          Simulator Pemutar Audio Pembelajaran: Penjelasan_Guru.mp3
                        </span>
                        <button
                          onClick={() => {
                            playClick();
                            setIsPlayingAudioSim(!isPlayingAudioSim);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          {isPlayingAudioSim ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlayingAudioSim ? 'Jeda Suara' : 'Uji Suara Gelombang'}</span>
                        </button>
                      </div>

                      {/* Equalizer Wave Simulator */}
                      <div className="p-4 rounded-xl bg-slate-950 flex items-center justify-center gap-1.5 h-16">
                        {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 35, 85, 55, 75, 65, 90, 40].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1.5 rounded-full transition-all duration-150 ${
                              isPlayingAudioSim
                                ? 'bg-gradient-to-t from-amber-500 to-amber-300'
                                : 'bg-slate-700'
                            }`}
                            style={{
                              height: isPlayingAudioSim ? `${Math.max(15, (h * ((i % 3) + 1)) % 100)}%` : '20%'
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                        Gelombang audio digital disimpan dalam sampel frekuensi suara (Hz) yang dapat diputar tanpa piringan hitam fisik!
                      </p>
                    </div>
                  )}

                  {activeFormatTab === 'video' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-purple-700 dark:text-purple-400">
                          Mockup Video Edukasi: Tutorial_Informatika_Kelas7.mp4
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono">
                          1080p Full HD
                        </span>
                      </div>
                      <div className="aspect-[16/9] max-h-48 rounded-xl bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden group">
                        <div className="text-center space-y-2 p-4">
                          <div className="w-12 h-12 rounded-full bg-purple-600/80 hover:bg-purple-500 flex items-center justify-center mx-auto cursor-pointer transition-transform group-hover:scale-110">
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          </div>
                          <div className="text-xs font-bold">Animasi Penjelasan: Bagaimana Data Dikirim Lewat Internet</div>
                          <div className="text-[11px] text-purple-200 font-mono">Durasi: 03:45 · Resolusi: 1920x1080 · 60 FPS</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* KONSEP 4: Cara Mencari Informasi Digital yang Tepat */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    Konsep 4
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    4. Cara Mencari Informasi Digital yang Tepat di Mesin Pencari
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Search className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {materi.keyConcepts[3]?.explanation}
              </p>

              {/* SIMULASI MESIN PENCARI INTERAKTIF */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    🔍 Simulator Google Search Cerdas untuk Siswa SMP
                  </span>
                  <span className="text-[11px] text-slate-500">Pilih kata kunci untuk melihat bedanya:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { playClick(); setSearchSimKeyword('kurang-tepat'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      searchSimKeyword === 'kurang-tepat'
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    ❌ Kata Kunci Umum: <span className="font-mono">"lumut"</span>
                  </button>
                  <button
                    onClick={() => { playClick(); setSearchSimKeyword('tepat'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      searchSimKeyword === 'tepat'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    ✅ Kata Kunci Spesifik: <span className="font-mono">"ciri-ciri tumbuhan lumut" kelas 7 IPA</span>
                  </button>
                </div>

                {/* Simulated Google Search Box */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono">
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>
                      {searchSimKeyword === 'tepat'
                        ? '"ciri-ciri tumbuhan lumut" kelas 7 IPA'
                        : 'lumut'}
                    </span>
                  </div>

                  {searchSimKeyword === 'tepat' ? (
                    <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono">
                        sumberbelajar.kemdikbud.go.id &gt; ipa-smp &gt; lumut
                      </div>
                      <h5 className="text-sm font-bold text-sky-700 dark:text-sky-300 hover:underline cursor-pointer">
                        Morfologi & Ciri-Ciri Tumbuhan Lumut (Bryophyta) – Materi Kelas 7 SMP
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Hasil sangat tepat dan spesifik! Langsung memuat rangkuman materi IPA kurikulum resmi, ringkas, dan bebas iklan jebakan.
                      </p>
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        ⭐ Ditemukan dalam 0.28 detik · 100% Akurat untuk Tugas Sekolah
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-1.5">
                      <div className="text-[11px] text-rose-800 dark:text-rose-300 font-mono">
                        forum-bebas.com &gt; jual-beli &gt; obat-lumut-kolam
                      </div>
                      <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Jual Obat Pembasmi Lumut Kolam Ikan Murah (Hasil Tidak Relevan!)
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Terlalu umum! Kamu disuguhi 15 juta halaman iklan obat kolam, tanaman hias, dan berita umum yang tidak membantu tugas IPA sekolah.
                      </p>
                    </div>
                  )}
                </div>

                {/* Anatomi URL Website */}
                <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 space-y-2">
                  <div className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Anatomi Alamat Website Resmi & Terpercaya:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      https:// (Aman/Terkunci 🔒)
                    </span>
                    <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                      smpn5kroya (Nama Sekolah)
                    </span>
                    <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold underline">
                      .sch.id (Sekolah Resmi RI 🇮🇩)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KONSEP 5: Kredibilitas Sumber Informasi Digital */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-xs">
                    Konsep 5
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    5. Kredibilitas Sumber Informasi Digital (Detektif Fakta)
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {materi.keyConcepts[4]?.explanation}
              </p>

              {/* CEKLIS DETEKTIF FAKTA INTERAKTIF */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    🕵️ Checklist Detektif Fakta: Sentuh Tiap Langkah untuk Memverifikasi!
                  </span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Skor: {Object.values(checkedFactItems).filter(Boolean).length}/5 Terverifikasi
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { title: '1. Periksa Nama Penulis & Lembaga', desc: 'Ada nama guru atau institusi resmi yang bertanggung jawab (bukan anonim).' },
                    { title: '2. Periksa Domain Web (.sch.id, .go.id, .ac.id)', desc: 'Domain resmi pemerintah dan sekolah diverifikasi izin dinas.' },
                    { title: '3. Periksa Tanggal Publikasi', desc: 'Pastikan informasi masih baru dan relevan, bukan kabar usang 5 tahun lalu.' },
                    { title: '4. Waspadai Judul Bombastis (Clickbait)', desc: 'Hindari artikel berhuruf kapital heboh yang memancing kepanikan.' },
                    { title: '5. Bandingkan dengan Buku Paket & Guru', desc: 'Cocokkan fakta dengan buku teks pelajaran resmi di sekolah.' }
                  ].map((item, idx) => {
                    const isChecked = !!checkedFactItems[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleFactCheck(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <strong className="font-bold text-slate-900 dark:text-white block">{item.title}</strong>
                          <span className="text-[11px] opacity-90">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* UMUM: TOPIK INFORMATIKA LAINNYA                          */
          /* ======================================================== */
          <div className="grid grid-cols-1 gap-6">
            {materi.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-xs">
                      Konsep {idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {concept.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 font-bold">
                    #{idx + 1}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {concept.explanation}
                </p>

                {concept.bulletPoints.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {concept.bulletPoints.map((bp, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
                        <span className="leading-relaxed font-medium">{bp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. VISUAL COMPARISON MATRIX (TABEL PERBANDINGAN BERGAMBAR) */}
      {materi.comparisonTable && (
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Perbandingan Visual
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {materi.comparisonTable.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kartu Sisi Kiri (Terpercaya / Benar) */}
            <div className="p-5 rounded-3xl border-2 border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{materi.comparisonTable.headers[1] || 'Sumber Terpercaya 👍'}</span>
              </div>
              <div className="space-y-2.5">
                {materi.comparisonTable.rows.map((row, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase block tracking-wider">
                      {row[0]}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed block">
                      {row[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kartu Sisi Kanan (Meragukan / Perlu Waspada) */}
            <div className="p-5 rounded-3xl border-2 border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-extrabold text-sm uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>{materi.comparisonTable.headers[2] || 'Sumber Meragukan (Waspada!) ⚠️'}</span>
              </div>
              <div className="space-y-2.5">
                {materi.comparisonTable.rows.map((row, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase block tracking-wider">
                      {row[0]}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed block">
                      {row[2]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. DIAGRAM ALUR / ROADMAP LANGKAH (FLOW DIAGRAM) */}
      {materi.flowDiagram && (
        <section className="space-y-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Peta Alur Kerja
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {materi.flowDiagram.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {materi.flowDiagram.steps.map((step, idx) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/30 dark:to-slate-900 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Langkah {idx + 1}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CALLOUT BOXES: TAHUKAH KAMU?, FAKTA MENARIK, INFO PENTING */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tahukah Kamu */}
        <div className="p-5 rounded-3xl border-2 border-amber-300 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Tahukah Kamu?</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {materi.tahukahKamu}
          </p>
        </div>

        {/* Fakta Menarik */}
        <div className="p-5 rounded-3xl border-2 border-purple-300 dark:border-purple-900 bg-purple-50/60 dark:bg-purple-950/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Fakta Menarik</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {materi.faktaMenarik}
          </p>
        </div>

        {/* Info Penting */}
        <div className="p-5 rounded-3xl border-2 border-sky-300 dark:border-sky-900 bg-sky-50/60 dark:bg-sky-950/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
            <Info className="w-5 h-5 text-sky-600" />
            <span>Info Penting Guru</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {materi.infoPenting}
          </p>
        </div>
      </section>

      {/* 7. CONTOH NYATA SEHARI-HARI & DI SEKOLAH */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>Penerapan di Kehidupan Sehari-hari</span>
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {materi.dailyLifeExamples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span className="leading-relaxed font-medium">{ex}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Penerapan di SMP Negeri 5 Kroya</span>
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {materi.schoolExamples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />
                <span className="leading-relaxed font-medium">{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. KESALAHAN UMUM & RANGKUMAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kesalahan Umum */}
        <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Kesalahan yang Harus Dihindari:</span>
          </div>
          <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-200">
            {materi.commonMistakes.map((mis, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span className="leading-relaxed">{mis}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rangkuman */}
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <FileCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Rangkuman Inti Materi:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            {materi.summary.map((sum, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{sum}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 9. KUIS FORMATIF CEPAT DENGAN FEEDBACK INTERAKTIF */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
            Cek Pemahaman Instan
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Uji Cepat Pemahaman (Kuis Formatif Singkat)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pilih jawaban untuk melihat pembahasan visual langsung sebelum melanjutkan ke simulasi interaktif.
          </p>
        </div>

        <div className="space-y-4">
          {materi.formativeCheck.map((fc, qIdx) => {
            const hasChosen = formativeAnswers[qIdx] !== undefined;
            const chosen = formativeAnswers[qIdx];
            const isCorrect = chosen === fc.answerIndex;

            return (
              <div
                key={qIdx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 shrink-0">
                    Cek #{qIdx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {fc.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {fc.options.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectFormative(qIdx, optIdx)}
                        className={`p-3 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${
                          isSelected
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasChosen && (
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed animate-in fade-in duration-150 ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <strong>Pembahasan:</strong> {fc.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER NAVIGATION */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => {
            playClick();
            onBackToDashboard();
          }}
          className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          Menu Materi
        </button>

        <button
          onClick={() => {
            playClick();
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Lanjut ke Simulasi & Aktivitas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
