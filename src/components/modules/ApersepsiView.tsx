import React, { useState, useEffect } from 'react';
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
  Sparkles,
  RotateCcw,
  Shield,
  Check,
  X,
  ClipboardPaste
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

  // Initialize custom video from localStorage if saved by teacher/student, else topic default
  const storageKey = `custom_video_${topic.id}`;
  const [customVideoUrl, setCustomVideoUrl] = useState(() => {
    return localStorage.getItem(storageKey) || topic.apersepsi.defaultVideoUrl;
  });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoInput, setVideoInput] = useState(customVideoUrl);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Sync when topic changes
  useEffect(() => {
    const saved = localStorage.getItem(`custom_video_${topic.id}`);
    const url = saved || topic.apersepsi.defaultVideoUrl;
    setCustomVideoUrl(url);
    setVideoInput(url);
    setIsPlayingVideo(false);
  }, [topic.id, topic.apersepsi.defaultVideoUrl]);

  // Helper to extract YouTube ID
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const activeVideoId = extractYouTubeId(customVideoUrl);
  const inputVideoId = extractYouTubeId(videoInput);

  // Use YouTube thumbnail if available, otherwise topic fallback
  const displayThumbnail = activeVideoId
    ? `https://i.ytimg.com/vi/${activeVideoId}/hqdefault.jpg`
    : topic.apersepsi.videoThumbnail;

  const handleSaveHypothesis = () => {
    if (!hypothesis.trim()) return;
    playSuccess();
    setIsSaved(true);
    onSaveHypothesis(hypothesis);
  };

  const handleSaveVideoUrl = (shouldPlayNow: boolean = false) => {
    const trimmed = videoInput.trim();
    if (!trimmed) return;
    playSuccess();
    setCustomVideoUrl(trimmed);
    localStorage.setItem(storageKey, trimmed);
    setShowVideoModal(false);
    if (shouldPlayNow) {
      setIsPlayingVideo(true);
    }
  };

  const handleResetVideo = () => {
    playClick();
    const defaultUrl = topic.apersepsi.defaultVideoUrl;
    setVideoInput(defaultUrl);
    setCustomVideoUrl(defaultUrl);
    localStorage.removeItem(storageKey);
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
            activeVideoId ? (
              <div className="relative w-full h-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={topic.apersepsi.videoTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-md border border-white/20 transition-all shadow-lg"
                  title="Tutup Pemutar Video"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tutup Video</span>
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                <Video className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
                <h3 className="text-lg font-bold mb-2">{topic.apersepsi.videoTitle}</h3>
                <p className="text-xs text-slate-300 max-w-md mb-4">
                  Tautan video eksternal siap diputar. Kamu dapat membuka video di tab baru atau memasukkan tautan YouTube resmi.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={customVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 rounded-lg text-white shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Video di Tab Baru</span>
                  </a>
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200"
                  >
                    Tutup Pemutar
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              <img
                src={displayThumbnail}
                alt={topic.apersepsi.videoTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
              <button
                onClick={() => {
                  playClick();
                  setIsPlayingVideo(true);
                }}
                className="absolute z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xl transition-all transform hover:scale-110 active:scale-95"
                title="Putar Video Pemantik"
              >
                <Play className="w-8 h-8 fill-slate-950 ml-1" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow-xs">
                    Durasi {topic.apersepsi.videoDuration}
                  </span>
                  {activeVideoId && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-600/90 text-white shadow-xs flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>YouTube</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-md">
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
          <div className="flex items-center gap-3 shrink-0">
            {customVideoUrl !== topic.apersepsi.defaultVideoUrl && (
              <button
                onClick={handleResetVideo}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                title="Kembalikan ke video asli"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Asli</span>
              </button>
            )}
            <button
              onClick={() => {
                playClick();
                setVideoInput(customVideoUrl);
                setShowVideoModal(true);
              }}
              className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Ganti Tautan Video</span>
            </button>
          </div>
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
            onClick={handleSaveHypothesis}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-500" />
                <span>Ganti Tautan Video Pemantik</span>
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Guru atau siswa dapat memasukkan tautan YouTube dari Kok Bisa, Kemendikbud, atau materi lainnya yang relevan untuk kelas ini.
            </p>

            {/* Input Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>URL Video (YouTube / Web):</span>
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (navigator?.clipboard?.readText) {
                        const text = await navigator.clipboard.readText();
                        if (text && text.trim()) setVideoInput(text.trim());
                      }
                    } catch {
                      // Fallback if browser permission is blocked
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer"
                  title="Tempel dari Clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Tempel Link</span>
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <input
                  type="text"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="Contoh: https://youtu.be/ah-uZS0dyP8"
                  className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm font-mono rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-rose-500/15 shadow-sm transition-all"
                />
                <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
                  {videoInput && (
                    <button
                      type="button"
                      onClick={() => setVideoInput('')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Bersihkan Teks"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setVideoInput('https://youtu.be/ah-uZS0dyP8')}
                    className="px-2 py-1 text-[11px] font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors shadow-xs"
                    title="Gunakan link Hacker https://youtu.be/ah-uZS0dyP8"
                  >
                    Hacker URL
                  </button>
                </div>
              </div>
            </div>

            {/* Live Video Detection Status */}
            {inputVideoId ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <img
                  src={`https://i.ytimg.com/vi/${inputVideoId}/hqdefault.jpg`}
                  alt="Thumbnail Preview"
                  className="w-20 h-12 object-cover rounded-lg shrink-0 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tautan YouTube Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate">
                    ID Video: <span className="font-mono font-semibold">{inputVideoId}</span>
                  </p>
                </div>
              </div>
            ) : videoInput.trim() ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                Tautan bukan format standar YouTube, namun tetap dapat disimpan sebagai tautan luar.
              </div>
            ) : null}

            {/* Presets & Quick Selection */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Pilihan Rekomendasi Video Edukasi:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => setVideoInput('https://www.youtube.com/watch?v=ah-uZS0dyP8')}
                  className={`p-2 text-left rounded-lg text-xs border transition-all flex items-center justify-between ${
                    videoInput === 'https://www.youtube.com/watch?v=ah-uZS0dyP8'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">🛡️ Kok Bisa: Gimana Cara Hacker Ngebajak Komputer?</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">ah-uZS0dyP8</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoInput('https://www.youtube.com/watch?v=EUiVtW-45Ss')}
                  className={`p-2 text-left rounded-lg text-xs border transition-all flex items-center justify-between ${
                    videoInput === 'https://www.youtube.com/watch?v=EUiVtW-45Ss'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">🔍 Hujan Tanda Tanya: Kenapa Orang Cerdas Termakan Hoax?</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">EUiVtW-45Ss</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoInput(topic.apersepsi.defaultVideoUrl)}
                  className={`p-2 text-left rounded-lg text-xs border transition-all flex items-center justify-between ${
                    videoInput === topic.apersepsi.defaultVideoUrl
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">⭐ Video Bawaan Modul ({topic.title})</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">Default</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSaveVideoUrl(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl"
              >
                Simpan Saja
              </button>
              <button
                type="button"
                onClick={() => handleSaveVideoUrl(true)}
                className="flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md shadow-sky-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simpan & Putar Video</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

