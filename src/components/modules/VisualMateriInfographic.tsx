import React, { useState } from 'react';
import { Topic } from '../../types/curriculum';
import { APP_ASSETS } from '../../constants/assets';
import {
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  ShieldCheck,
  AlertTriangle,
  Search,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Maximize2,
  X,
  Split,
  Repeat,
  MapPin,
  GitBranch,
  Cpu,
  Monitor,
  HardDrive,
  Wifi,
  Lock,
  Code,
  Table,
  Check
} from 'lucide-react';

interface VisualMateriInfographicProps {
  topic: Topic;
}

export const VisualMateriInfographic: React.FC<VisualMateriInfographicProps> = ({ topic }) => {
  const [selectedVisualCard, setSelectedVisualCard] = useState<number | null>(null);
  const [showFullImageModal, setShowFullImageModal] = useState<string | null>(null);

  const isDigitalInfo = topic.id === 'k7-idk';
  const isComputationalThinking = topic.id === 'k7-bk';
  const isComputerOrNetwork = topic.id.includes('komputer') || topic.id.includes('jaringan') || topic.id.includes('koneksi');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HERO VISUAL INFOGRAPHIC BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 group">
        <div className="aspect-[16/9] max-h-[380px] w-full relative overflow-hidden bg-slate-900">
          <img
            src={
              isComputerOrNetwork
                ? APP_ASSETS.infographicHardware
                : APP_ASSETS.infographicDigital
            }
            alt={`Infografis Visual Edukasi - ${topic.title}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay Gradient & Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/30 backdrop-blur-md border border-sky-400/40 text-sky-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Infografis Visual Kelas Informatika</span>
                </span>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                  Peta Visual Pembelajaran: {topic.title}
                </h3>
              </div>

              <button
                onClick={() =>
                  setShowFullImageModal(
                    isComputerOrNetwork
                      ? APP_ASSETS.infographicHardware
                      : APP_ASSETS.infographicDigital
                  )
                }
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Perbesar Gambar Infografis"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Perbesar Visual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOPIC-SPECIFIC RICH VISUAL EXPLORER */}

      {/* A. VISUAL KHUSUS: INFORMASI DIGITAL (k7-idk) */}
      {isDigitalInfo && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Galeri Visual Jenis Informasi Digital
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Kenali 4 Bentuk Informasi Digital yang Kamu Temui Tiap Hari!
            </h3>
          </div>

          {/* 4 Kartu Visual Bergambar Interaktif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Teks */}
            <div className="p-5 rounded-3xl border-2 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-3 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  Format Dokumen
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  1. Teks Digital
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Tulisan elektronik yang bisa dibaca dan dicari dengan cepat di layar HP atau komputer.
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Contoh:</strong> E-book buku paket, artikel web, modul PDF, catatan di Google Keep.</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">.PDF · .DOCX · .TXT</div>
              </div>
            </div>

            {/* Card 2: Gambar */}
            <div className="p-5 rounded-3xl border-2 border-sky-400 bg-sky-50/60 dark:bg-sky-950/40 space-y-3 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                  Format Visual
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  2. Gambar & Infografis
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Gambar diam, foto jepretan kamera, diagram grafik, dan poster penjelasan yang mempermudah pemahaman.
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Contoh:</strong> Foto praktikum IPA, diagram alur, poster kegiatan OSIS SMPN 5 Kroya.</div>
                <div className="text-sky-600 dark:text-sky-400 font-mono font-bold">.JPG · .PNG · .SVG</div>
              </div>
            </div>

            {/* Card 3: Audio */}
            <div className="p-5 rounded-3xl border-2 border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 space-y-3 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Headphones className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  Format Suara
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  3. Audio Digital
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Informasi dalam bentuk rekaman gelombang suara yang bisa didengar lewat earphone atau speaker.
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Contoh:</strong> Rekaman suara pesan guru, podcast edukasi, lagu pengiring fokus.</div>
                <div className="text-amber-600 dark:text-amber-400 font-mono font-bold">.MP3 · .WAV · .M4A</div>
              </div>
            </div>

            {/* Card 4: Video */}
            <div className="p-5 rounded-3xl border-2 border-purple-400 bg-purple-50/60 dark:bg-purple-950/40 space-y-3 shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  Audio Visual
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  4. Video Digital
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Perpaduan gambar bergerak dan suara yang sangat hidup untuk melihat simulasi atau langkah praktikum.
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div><strong>Contoh:</strong> Video tutorial YouTube, animasi peredaran darah, rekaman zoom kelas.</div>
                <div className="text-purple-600 dark:text-purple-400 font-mono font-bold">.MP4 · .WEBM · .MKV</div>
              </div>
            </div>
          </div>

          {/* DIAGRAM VISUAL DETEKTIF KREDIBILITAS: RESMI VS MERAGUKAN */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Search className="w-4 h-4" />
              <span>Inspektur Visual: Cara Cepat Memeriksa Alamat Web di Layar HP</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Web Resmi Kredibel */}
              <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Domain Resmi Terpercaya (.sch.id / .go.id)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-[10px] font-bold text-emerald-800 dark:text-emerald-200">
                    Sangat Kredibel
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 font-mono text-xs flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span className="text-emerald-600 font-bold">🔒 https://</span>
                  <span>smpn5kroya.<strong className="text-emerald-600 underline">sch.id</strong></span>
                </div>

                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dikelola resmi oleh dewan guru dan sekolah.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ada nama penulis dan penanggung jawab yang jelas.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bebas dari iklan judi, obat terlarang, atau pop-up jebakan.</span>
                  </li>
                </ul>
              </div>

              {/* Web Meragukan */}
              <div className="p-5 rounded-2xl border-2 border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Blog Gratisan & Pesan Berantai Anonim</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-[10px] font-bold text-rose-800 dark:text-rose-200">
                    Perlu Waspada!
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-800 font-mono text-xs flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span className="text-amber-500 font-bold">⚠️ http://</span>
                  <span>info-kaget-gratis.<strong className="text-rose-600 underline">blogspot.com</strong></span>
                </div>

                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Penulis tidak diketahui (anonim / nama samaran).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Judul sangat bombastis (clickbait) untuk menarik klik iklan.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Tidak mencantumkan sumber riset atau konfirmasi fakta.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. VISUAL KHUSUS: BERPIKIR KOMPUTASIONAL (k7-bk) */}
      {isComputationalThinking && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Peta Visual 4 Pilar
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              4 Pilar Berpikir Komputasional dalam Keseharian Siswa
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl border-2 border-sky-400 bg-sky-50/50 dark:bg-sky-950/40 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center">
                <Split className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">1. Dekomposisi</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Memecah masalah rumit menjadi potongan kecil yang mudah dikerjakan satu per satu.
              </p>
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 block pt-1">
                Contoh: Membagi tugas kelompok piket kebersihan kelas.
              </span>
            </div>

            <div className="p-5 rounded-3xl border-2 border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
                <Repeat className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">2. Pengenalan Pola</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Melihat pola kesamaan atau keteraturan data yang berulang secara teratur.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block pt-1">
                Contoh: Mengenali jadwal jam pelajaran yang selalu berulang tiap pekan.
              </span>
            </div>

            <div className="p-5 rounded-3xl border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/40 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">3. Abstraksi</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Menyaring informasi penting saja dan membuang detail yang tidak relevan.
              </p>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block pt-1">
                Contoh: Hanya melihat nama jalan utama pada denah lokasi acara.
              </span>
            </div>

            <div className="p-5 rounded-3xl border-2 border-purple-400 bg-purple-50/50 dark:bg-purple-950/40 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center">
                <GitBranch className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">4. Algoritma</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Menyusun urutan langkah logis yang teratur dari awal hingga masalah selesai.
              </p>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block pt-1">
                Contoh: Langkah menyalakan komputer lab: colok listrik &rarr; tombol CPU &rarr; monitor.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* C. VISUAL KHUSUS: HARDWARE & JARINGAN KOMPUTER */}
      {isComputerOrNetwork && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Alur Kerja Sistem Komputer & Jaringan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white mx-auto flex items-center justify-center font-bold">1</div>
              <h5 className="font-bold text-xs mt-2">Input Device</h5>
              <p className="text-[11px] text-slate-500">Keyboard, Mouse, Touchscreen IFP</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white mx-auto flex items-center justify-center font-bold">2</div>
              <h5 className="font-bold text-xs mt-2">Processing (CPU)</h5>
              <p className="text-[11px] text-slate-500">Otak pemroses data dan instruksi</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white mx-auto flex items-center justify-center font-bold">3</div>
              <h5 className="font-bold text-xs mt-2">Output Device</h5>
              <p className="text-[11px] text-slate-500">Monitor, Proyektor, Speaker</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white mx-auto flex items-center justify-center font-bold">4</div>
              <h5 className="font-bold text-xs mt-2">Storage / Cloud</h5>
              <p className="text-[11px] text-slate-500">SSD, Flashdisk, Google Drive</p>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {showFullImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl p-4 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setShowFullImageModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={showFullImageModal}
                alt="Visual Infografis Layar Penuh"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 text-center text-xs text-slate-300">
              Infografis Visual Pembelajaran Informatika · SMP Negeri 5 Kroya
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
