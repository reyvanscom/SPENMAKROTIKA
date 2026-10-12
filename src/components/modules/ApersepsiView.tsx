import React, { useState } from 'react';
import { Topic, StudentProgress } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import {
  Lightbulb,
  Play,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Video,
  ExternalLink,
  Edit2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ApersepsiViewProps {
  topic: Topic;
  progress: StudentProgress;
  onSaveHypothesis: (text: string) => void;
  onNext: () => void;
  onBackToDashboard: () => void;
}

export const ApersepsiView: React.FC<ApersepsiViewProps> = ({
  topic,
  progress,
  onSaveHypothesis,
  onNext,
  onBackToDashboard
}) => {
  const { playClick, playSuccess } = useTheme();
  const [hypothesis, setHypothesis] = useState(progress.apersepsiHypothesis || '');
  const [isSaved, setIsSaved] = useState(Boolean(progress.apersepsiHypothesis));
  const [customVideoUrl, setCustomVideoUrl] = useState(topic.apersepsi.defaultVideoUrl);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoInput, setVideoInput] = useState(topic.apersepsi.defaultVideoUrl);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleSave = () => {
    if (!hypothesis.trim()) return;
    playSuccess();
    setIsSaved(true);
    onSaveHypothesis(hypothesis);
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Navigation Top Bar */}
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

        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          Modul 1 dari 8 · Apersepsi
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>Membangkitkan Rasa Ingin Tahu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Apersepsi: Mengapa Kita Mempelajari {topic.title}?
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Perhatikan masalah nyata di sekitarmu sebelum mempelajari konsep secara formal.
        </p>
      </div>

      {/* Interactive Video & Visual Trigger Container */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden group">
          {isPlayingVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
              <Video className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
              <h3 className="text-lg font-bold mb-2">{topic.apersepsi.videoTitle}</h3>
              <p className="text-xs text-slate-300 max-w-md mb-4">
                Video pemantik interaktif sedang disimulasikan. Kamu juga dapat membuka video resmi di tautan luar atau mengganti URL video.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={customVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 rounded-lg text-white shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di YouTube / Tab Baru</span>
                </a>
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200"
                >
                  Tutup Pemutar
                </button>
              </div>
            </div>
          ) : (
            <>
              <img
                src={topic.apersepsi.videoThumbnail}
                alt={topic.apersepsi.videoTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <button
                onClick={() => {
                  playClick();
                  setIsPlayingVideo(true);
                }}
                className="absolute z-10 flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl transition-all transform hover:scale-110 active:scale-95"
                title="Putar Video Pemantik"
              >
                <Play className="w-7 h-7 fill-slate-950 ml-1" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 mr-2">
                  Durasi {topic.apersepsi.videoDuration}
                </span>
                <h4 className="text-base sm:text-lg font-bold mt-1 text-white">
                  {topic.apersepsi.videoTitle}
                </h4>
              </div>
            </>
          )}
        </div>

        {/* Video Controls & Custom URL setting */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {topic.apersepsi.videoDescription}
          </p>
          <button
            onClick={() => {
              playClick();
              setShowVideoModal(true);
            }}
            className="flex items-center gap-1.5 font-semibold text-sky-600 dark:text-sky-400 hover:underline shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Ganti Tautan Video</span>
          </button>
        </div>
      </div>

      {/* Cerita Masalah Nyata Sehari-Hari */}
      <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Studi Kasus / Masalah Nyata di Kehidupan Siswa</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          {topic.apersepsi.realLifeStory}
        </p>
      </div>

      {/* Pertanyaan Pemantik (Trigger Questions) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Pertanyaan Pemantik Pikiran:</span>
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {topic.apersepsi.triggerQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {q}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom Menuliskan Dugaan / Pendapat Awal Peserta Didik */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <div>
          <label className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
            Tuliskan Dugaan atau Pendapat Awalmu:
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jangan takut salah! Apersepsi bertujuan melatih keberanian berpendapat. Tuliskan apa yang kamu pikirkan mengenai masalah di atas.
          </p>
        </div>

        <textarea
          rows={4}
          value={hypothesis}
          onChange={(e) => {
            setHypothesis(e.target.value);
            setIsSaved(false);
          }}
          placeholder="Menurut pendapat saya, masalah tersebut terjadi karena... Solusi awal yang saya bayangkan adalah..."
          className="w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pendapat awal berhasil disimpan! Keren, rasa ingin tahumu sudah aktif.</span>
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={!hypothesis.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg shadow-sm transition-colors self-end"
          >
            Simpan Pendapat Awal
          </button>
        </div>
      </div>

      {/* Footer Navigation: Lanjut ke Asesmen Awal */}
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
          className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <span>Lanjut ke Asesmen Awal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Video URL Edit Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ganti Tautan Video Pemantik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guru atau siswa dapat memasukkan tautan video YouTube atau video pembelajaran lain yang relevan.
            </p>
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setCustomVideoUrl(videoInput);
                  setShowVideoModal(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg"
              >
                Simpan Tautan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
