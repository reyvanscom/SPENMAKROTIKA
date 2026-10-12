import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Topic } from '../../../types/curriculum';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowRight,
  School,
  Lightbulb
} from 'lucide-react';

interface ScenarioChallengeProps {
  topic: Topic;
}

export const ScenarioChallengeSimulation: React.FC<ScenarioChallengeProps> = ({ topic }) => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();

  // Generate dynamic contextual scenarios based on topic category / title
  const getScenarios = () => {
    const t = topic.title.toLowerCase();

    if (t.includes('informasi digital') || t.includes('kredibilitas') || t.includes('fakta')) {
      return [
        {
          id: 1,
          title: 'Tugas Makalah IPA di Perpustakaan',
          story: 'Rizky sedang mencari materi tentang "Daur Hidup Kupu-Kupu". Hasil pencarian nomor satu berasal dari blog pribadi anonim tanpa sumber rujukan ilmiah, sedangkan hasil nomor tiga berasal dari Rumah Belajar Kemdikbud.',
          question: 'Apa langkah paling bijak yang harus diambil Rizky agar tugasnya mendapat nilai maksimal?',
          options: [
            { text: 'Memilih rujukan dari Rumah Belajar Kemdikbud karena disusun oleh ahli pendidikan dan terpercaya', isCorrect: true, reason: 'Tepat sekali! Memilih portal resmi menjamin kebenaran materi tugas.' },
            { text: 'Langsung menyalin artikel blog anonim karena berada di urutan teratas', isCorrect: false, reason: 'Urutan teratas tidak selalu berarti paling terpercaya; bisa saja karena trik SEO.' },
            { text: 'Menyerah dan tidak mengerjakan tugas', isCorrect: false, reason: 'Selalu ada solusi literasi yang bisa dipelajari!' }
          ]
        },
        {
          id: 2,
          title: 'Pesan Berantai WhatsApp di Grup Kelas',
          story: 'Di grup kelas 7 SMPN 5 Kroya, seorang teman membagikan link: "Klik di sini untuk klaim pulsa 100 ribu dari pemerintah!". Tautan tersebut berakhiran .xyz dan meminta nomor HP.',
          question: 'Sikap apa yang mencerminkan kecakapan digital siswa berkarakter?',
          options: [
            { text: 'Mengingatkan teman-teman agar tidak mengeklik link tersebut karena itu adalah penipuan (phishing)', isCorrect: true, reason: 'Luar biasa! Melindungi teman dari bahaya penipuan digital adalah sikap terpuji.' },
            { text: 'Ikut membagikan link tersebut ke keluarga agar semua dapat pulsa', isCorrect: false, reason: 'Tautan berbahaya bisa menyebarkan malware dan membobol data orang lain.' },
            { text: 'Memasukkan nomor rekening orang tua', isCorrect: false, reason: 'Sangat berbahaya dan bisa memicu pencurian data rahasia.' }
          ]
        },
        {
          id: 3,
          title: 'Memasukkan Sumber Sitasi pada Laporan',
          story: 'Nisa selesai mengetik artikel tugas Informatika. Temannya menyarankan untuk hanya menulis "Sumber: Google" di daftar pustaka.',
          question: 'Bagaimana tanggapan yang benar sesuai kaidah etika digital?',
          options: [
            { text: 'Google adalah mesin pencari, kita harus mencantumkan nama penulis dan situs asli pembuat artikel', isCorrect: true, reason: 'Benar! Google bukan pembuat tulisan, melainkan hanya mesin perantara.' },
            { text: 'Menyetujui saran teman karena menulis nama situs asli terlalu panjang', isCorrect: false, reason: 'Tidak mencantumkan sumber asli melanggar etika hak cipta karya orang lain.' },
            { text: 'Tidak usah mencantumkan sumber sama sekali', isCorrect: false, reason: 'Setiap karya rujukan wajib dicantumkan sumbernya secara jujur.' }
          ]
        }
      ];
    }

    if (t.includes('jaringan') || t.includes('koneksi')) {
      return [
        {
          id: 1,
          title: 'Praktikum ANBK di Laboratorium Komputer',
          story: 'Saat ujian berlangsung, komputer PC Siswa 05 tiba-tiba tidak bisa memuat soal, sedangkan 29 komputer lainnya lancar tanpa gangguan.',
          question: 'Pemeriksaan fisik pertama yang paling tepat dilakukan sesuai konsep topologi Star adalah...',
          options: [
            { text: 'Memeriksa apakah kabel LAN RJ45 di belakang PC Siswa 05 terpasang rapat dan lampu port menyala', isCorrect: true, reason: 'Tepat! Pada topologi Star, gangguan lokal biasanya terjadi pada kabel node yang bersangkutan.' },
            { text: 'Mematikan saklar listrik utama seluruh sekolah', isCorrect: false, reason: 'Tindakan gegabah yang merugikan semua siswa lain.' },
            { text: 'Membongkar casing switch pusat', isCorrect: false, reason: 'Switch berfungsi normal karena 29 komputer lain tidak bermasalah.' }
          ]
        },
        {
          id: 2,
          title: 'Memilih Koneksi untuk Presentasi di Depan Kelas',
          story: 'Kelompok 2 ingin menampilkan video tugas dari HP ke Smart TV / Layar Sentuh IFP kelas.',
          question: 'Teknologi nirkabel manakah yang paling praktis digunakan tanpa mencolok kabel?',
          options: [
            { text: 'Menggunakan Screen Mirroring melalui koneksi Wi-Fi yang sama dengan IFP', isCorrect: true, reason: 'Sangat praktis! Screen Mirroring memancarkan tampilan layar ponsel ke IFP secara nirkabel.' },
            { text: 'Memotong kabel listrik TV', isCorrect: false, reason: 'Tindakan berbahaya yang dilarang di sekolah!' },
            { text: 'Menggunakan kabel tali rafia', isCorrect: false, reason: 'Tali rafia bukan media transmisi data digital.' }
          ]
        }
      ];
    }

    // Default universal scenarios for other topics
    return [
      {
        id: 1,
        title: 'Kerja Kelompok Proyek Informatika di SMPN 5 Kroya',
        story: `Tim siswa sedang menyelesaikan proyek tugas materi "${topic.title}". Mereka memiliki waktu 3 hari sebelum batas pengumpulan.`,
        question: 'Langkah computational thinking manakah yang paling efektif untuk memulai kerja kelompok?',
        options: [
          { text: 'Dekomposisi: membagi tugas menjadi riset materi, perancangan slide, dan pengetikan laporan', isCorrect: true, reason: 'Bagus sekali! Memecah tugas besar membuat pekerjaan selesai lebih cepat dan merata.' },
          { text: 'Menyerahkan semua beban kerja ke satu ketua kelompok saja', isCorrect: false, reason: 'Kerja kelompok harus didasari kolaborasi dan gotong royong.' },
          { text: 'Menunda pekerjaan sampai menit terakhir sebelum pengumpulan', isCorrect: false, reason: 'Menunda tugas menyebabkan hasil tidak maksimal dan terburu-buru.' }
        ]
      },
      {
        id: 2,
        title: 'Menghadapi Error saat Mengoperasikan Aplikasi',
        story: 'Saat menjalankan aplikasi pembelajaran, muncul pesan peringatan dan program tidak berjalan sesuai harapan.',
        question: 'Tindakan apa yang mencerminkan pemecahan masalah (debugging) yang tepat?',
        options: [
          { text: 'Membaca pesan peringatan dengan tenang, lalu memeriksa kembali langkah instruksi yang terlewat', isCorrect: true, reason: 'Sikap tenang dan analitis adalah ciri utama siswa melek teknologi.' },
          { text: 'Memukul keyboard dan mematikan laptop secara paksa', isCorrect: false, reason: 'Dapat merusak perangkat keras dan menghilangkan data yang belum tersimpan.' },
          { text: 'Menyalahkan teman sebangku', isCorrect: false, reason: 'Kesalahan logika program harus diselesaikan secara rasional.' }
        ]
      }
    ];
  };

  const scenarios = getScenarios();
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const currentScenario = scenarios[selectedScenarioIdx];
  const selectedOptionIdx = userAnswers[selectedScenarioIdx];
  const isAnswered = selectedOptionIdx !== undefined;

  const handleSelectOption = (idx: number) => {
    playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [selectedScenarioIdx]: idx
    }));

    if (currentScenario.options[idx].isCorrect) {
      playFanfare();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } else {
      playError();
    }
  };

  const handleReset = () => {
    playClick();
    setUserAnswers({});
    setSelectedScenarioIdx(0);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-amber-600 to-orange-700 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
          <School className="w-4 h-4" />
          <span>Simulasi Studi Kasus Sehari-Hari SMP Negeri 5 Kroya</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Tantangan Pengambilan Keputusan Cerdas Siswa Digital
        </h2>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
          Hadapi situasi nyata yang sering terjadi di sekolah, lab komputer, dan lingkungan belajarmu.
          Pilih tindakan terbaik dan lihat konsekuensi logis dari setiap keputusan!
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {scenarios.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                playClick();
                setSelectedScenarioIdx(idx);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedScenarioIdx === idx
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Kasus #{idx + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Kasus</span>
        </button>
      </div>

      {/* Active Scenario Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Studi Kasus Kontekstual #{selectedScenarioIdx + 1}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {currentScenario.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            {currentScenario.story}
          </p>
        </div>

        {/* Question & Choices */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            {currentScenario.question}
          </h4>

          <div className="space-y-2.5">
            {currentScenario.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-98 space-y-1.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-100 ring-4 ring-emerald-500/20'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-100 ring-4 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-amber-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 text-xs sm:text-sm font-bold">
                    <span>{opt.text}</span>
                    {isSelected && (
                      <span className="shrink-0 font-bold">
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                        )}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div
                      className={`text-xs p-2.5 rounded-xl ${
                        opt.isCorrect
                          ? 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-100/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      {opt.reason}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
