import React from 'react';
import { Grade, Topic } from '../types/curriculum';
import { getTopicsByGrade } from '../data/allTopics';
import { APP_ASSETS } from '../constants/assets';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, BookOpen, HelpCircle, User, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface HeroHomeViewProps {
  selectedGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartLearning: () => void;
  onNavigateGuide: () => void;
  onNavigateTeacher: () => void;
}

export const HeroHomeView: React.FC<HeroHomeViewProps> = ({
  selectedGrade,
  onSelectGrade,
  selectedTopic,
  onSelectTopic,
  onStartLearning,
  onNavigateGuide,
  onNavigateTeacher
}) => {
  const { playClick } = useTheme();
  const currentGradeTopics = getTopicsByGrade(selectedGrade);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      {/* Hero Header Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: School Emblem, Main Title, Subtitle, CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* School Identifier */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold">
            <img
              src={APP_ASSETS.logo}
              alt="Logo Resmi SMPN 5 Kroya"
              className="w-4 h-4 object-contain"
            />
            <span>SMP NEGERI 5 KROYA · KABUPATEN CILACAP</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
              SPENMAKRO SMART INFORMATIKA
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              Media Pembelajaran Interaktif (MPI) Informatika Kurikulum Merdeka untuk Peserta Didik SMP Kelas 7, 8, dan 9.
            </p>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playClick();
                onStartLearning();
              }}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>MULAI BELAJAR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playClick();
                onNavigateGuide();
              }}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-sky-500" />
              <span>PETUNJUK PENGGUNAAN</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onNavigateTeacher();
              }}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
            >
              <User className="w-4 h-4 text-emerald-500" />
              <span>TENTANG GURU</span>
            </button>
          </div>

          {/* Teacher Badge & Tech Features Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => {
                playClick();
                onNavigateTeacher();
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left group"
            >
              <img
                src={APP_ASSETS.teacherPhotoReal}
                alt="Foto Profil Guru Pengampu"
                className="w-6 h-6 rounded-full object-cover border border-sky-500 group-hover:scale-105 transition-transform"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Guru Pengampu:</span>
              <span className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">{APP_ASSETS.teacherName}</span>
            </button>
            <span>·</span>
            <div>Mendukung Proyektor, IFP & Smartphone</div>
          </div>
        </div>

        {/* Right Column: Hero High-Fidelity Illustration */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800 aspect-[16/10] group">
            <img
              src={APP_ASSETS.hero}
              alt="Siswa SMP Belajar Informatika dan Robotika di SMP Negeri 5 Kroya"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kelas Pintar Informatika</span>
              </div>
              <p className="text-xs text-slate-200 mt-1">
                Kreativitas, penalaran komputasional, dan karakter Pelajar Pancasila di era digital.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Class & Topic Selector Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Pilihan Jenjang Kelas & Materi Informatika
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pilih jenjang kelas terlebih dahulu, lalu pilih materi yang ingin dipelajari secara interaktif.
            </p>
          </div>

          {/* Grade Selector Tabs (Kelas 7, Kelas 8, Kelas 9) */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-start">
            {([7, 8, 9] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  playClick();
                  onSelectGrade(g);
                  const firstOfGrade = getTopicsByGrade(g)[0];
                  if (firstOfGrade) onSelectTopic(firstOfGrade);
                }}
                className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  selectedGrade === g
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Kelas {g}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Topic Notice Banner */}
        <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-600 text-white shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                Materi Terpilih (Kelas {selectedGrade})
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {selectedTopic.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onStartLearning();
            }}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors whitespace-nowrap self-end sm:self-center"
          >
            <span>BUKA MATERI INI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Topic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentGradeTopics.map((topic, index) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => {
                  playClick();
                  onSelectTopic(topic);
                }}
                className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 dark:border-sky-400 bg-sky-50/40 dark:bg-sky-950/30 ring-2 ring-sky-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Materi {index + 1} · Kelas {topic.grade}
                    </span>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 group-hover:text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {topic.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{topic.category}</span>
                  <span className="font-medium text-sky-600 dark:text-sky-400">
                    {isSelected ? 'Klik Masuk' : 'Pilih Materi'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
