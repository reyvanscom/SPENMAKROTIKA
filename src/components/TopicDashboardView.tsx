import React from 'react';
import { Topic, ModuleType, StudentProgress } from '../types/curriculum';
import { useTheme } from '../context/ThemeContext';
import { APP_ASSETS } from '../constants/assets';
import {
  Lightbulb,
  FileQuestion,
  BookOpen,
  Sliders,
  Gamepad2,
  CheckSquare,
  Award,
  HeartHandshake,
  FileText,
  User,
  HelpCircle,
  Home,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface TopicDashboardViewProps {
  topic: Topic;
  progress: StudentProgress;
  onSelectModule: (module: ModuleType) => void;
  onNavigateHome: () => void;
  onNavigateTeacher: () => void;
  onNavigateGuide: () => void;
}

export const TopicDashboardView: React.FC<TopicDashboardViewProps> = ({
  topic,
  progress,
  onSelectModule,
  onNavigateHome,
  onNavigateTeacher,
  onNavigateGuide
}) => {
  const { playClick } = useTheme();

  // Core curriculum modules for progress tracking (8 main stages)
  const coreModules: {
    id: ModuleType;
    title: string;
    subtitle: string;
    desc: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'apersepsi',
      title: '1. Apersepsi',
      subtitle: 'Rasa Ingin Tahu',
      desc: 'Pertanyaan pemantik, cerita masalah nyata, dan tebakan awal rasa ingin tahu.',
      icon: Lightbulb,
      color: 'bg-amber-500'
    },
    {
      id: 'asesmen-awal',
      title: '2. Asesmen Awal',
      subtitle: 'Diagnostik 5 Soal',
      desc: 'Tes diagnostik untuk memetakan pemahaman konsep awal dan rekomendasi belajar.',
      icon: FileQuestion,
      color: 'bg-sky-500'
    },
    {
      id: 'materi',
      title: '3. Materi Pembelajaran',
      subtitle: 'Konsep & Fakta Unik',
      desc: 'Penjelasan terstruktur, infografis, tabel komparasi, Tahukah Kamu?, dan mini formatif.',
      icon: BookOpen,
      color: 'bg-indigo-500'
    },
    {
      id: 'simulasi',
      title: '4. Simulasi dan Aktivitas',
      subtitle: 'Praktik Interaktif',
      desc: 'Aktivitas eksplorasi hands-on, klasifikasi drag-and-drop, dan simulasi komputasi.',
      icon: Sliders,
      color: 'bg-emerald-500'
    },
    {
      id: 'mini-game',
      title: '5. Mini Game Edukasi',
      subtitle: '3 Mode Seru',
      desc: 'Tantangan bermain: Mode Individu, Mode Duel (2 Pemain), dan Mode Kelompok (IFP).',
      icon: Gamepad2,
      color: 'bg-purple-500'
    },
    {
      id: 'kuis',
      title: '6. Kuis Interaktif',
      subtitle: '10 Soal HOTS',
      desc: 'Uji pemahaman bernalar dengan pembahasan tuntas setiap nomor soal.',
      icon: CheckSquare,
      color: 'bg-blue-600'
    },
    {
      id: 'asesmen-akhir',
      title: '7. Asesmen Akhir',
      subtitle: 'Penilaian Ketercapaian',
      desc: '10 soal evaluasi resmi (skor 0-100, predikat belajar, dan syarat sertifikat).',
      icon: Award,
      color: 'bg-rose-500'
    },
    {
      id: 'refleksi',
      title: '8. Refleksi Pembelajaran',
      subtitle: 'Penilaian Diri',
      desc: 'Ungkapkan perasaan belajar, hal yang dipahami, dan rencana tindak lanjut mandiri.',
      icon: HeartHandshake,
      color: 'bg-teal-500'
    }
  ];

  // Secondary modules
  const extraModules: {
    id: string;
    title: string;
    subtitle: string;
    desc: string;
    icon: React.ElementType;
    action: () => void;
  }[] = [
    {
      id: 'sertifikat',
      title: 'Sertifikat Hasil Belajar',
      subtitle: 'Sertifikat Resmi Cetak & PDF',
      desc: 'Dapatkan sertifikat resmi belajar SMPN 5 Kroya setelah menuntaskan asesmen akhir.',
      icon: FileText,
      action: () => onSelectModule('sertifikat')
    },
    {
      id: 'guru',
      title: 'Tentang Guru',
      subtitle: "Muhammad Rif'ani, S.Kom.",
      desc: 'Profil guru pengampu Informatika, motivasi belajar, dan identitas sekolah.',
      icon: User,
      action: onNavigateTeacher
    },
    {
      id: 'petunjuk',
      title: 'Petunjuk Penggunaan',
      subtitle: 'Panduan Siswa & Guru',
      desc: 'Tata cara belajar mandiri dan panduan mengajar via Proyektor / IFP di kelas.',
      icon: HelpCircle,
      action: onNavigateGuide
    }
  ];

  // Calculate completed count
  const completedCount = coreModules.filter((m) => progress.completedModules.includes(m.id)).length;
  const progressPercent = Math.round((completedCount / coreModules.length) * 100);

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return to Home Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <span>Kelas {topic.grade}</span>
            <span>·</span>
            <span>{topic.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {topic.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {topic.shortDesc}
          </p>
        </div>

        <button
          onClick={() => {
            playClick();
            onNavigateHome();
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shrink-0 self-start sm:self-center shadow-xs"
        >
          <Home className="w-4 h-4 text-sky-500" />
          <span>Ganti Materi / Beranda</span>
        </button>
      </div>

      {/* Learning Progress Indicator Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kemajuan Belajar Peserta Didik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount} dari {coreModules.length} modul pembelajaran selesai ({progressPercent}%)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-lg border border-sky-100 dark:border-sky-800 self-start sm:self-auto">
            <span>Status:</span>
            <span>
              {progressPercent === 100
                ? 'Selesai Sempurna! 🎉'
                : progressPercent > 50
                ? 'Berjalan Baik 👍'
                : 'Mulai Belajar 🚀'}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 8 Core Learning Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Alur Aktivitas Pembelajaran Interaktif</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreModules.map((mod) => {
            const Icon = mod.icon;
            const isCompleted = progress.completedModules.includes(mod.id);

            return (
              <div
                key={mod.id}
                onClick={() => {
                  playClick();
                  onSelectModule(mod.id);
                }}
                className={`group p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                  isCompleted
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-300 dark:hover:border-sky-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl text-white shadow-xs ${mod.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 group-hover:text-sky-500 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1">
                    {mod.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {mod.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium">
                    Buka Aktivitas
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Mulai &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Quick Action Cards (Certificate, Teacher, Guide) */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
          Layanan & Fitur Pendukung Pembelajaran
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {extraModules.map((ext) => {
            const Icon = ext.icon;
            const isCert = ext.id === 'sertifikat';
            const canPrintCert = Boolean(progress.finalAssessment);

            return (
              <div
                key={ext.id}
                onClick={() => {
                  playClick();
                  ext.action();
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                  isCert
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 overflow-hidden ${
                    isCert
                      ? 'bg-amber-500 text-white'
                      : ext.id === 'guru'
                      ? 'p-0 w-10 h-10 rounded-xl border border-sky-400/60 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {ext.id === 'guru' ? (
                    <img
                      src={APP_ASSETS.teacherPhotoReal}
                      alt="Foto Guru"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {ext.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {ext.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {ext.desc}
                  </p>
                  {isCert && (
                    <span className="inline-block mt-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                      {canPrintCert
                        ? '★ Siap Dicetak & Diunduh'
                        : '○ Tuntaskan Asesmen Akhir Terlebih Dahulu'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
