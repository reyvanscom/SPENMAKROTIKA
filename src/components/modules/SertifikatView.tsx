import React, { useState } from 'react';
import { Topic, StudentProgress } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import { APP_ASSETS } from '../../constants/assets';
import {
  Printer,
  Download,
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  Edit2
} from 'lucide-react';

interface SertifikatViewProps {
  topic: Topic;
  progress: StudentProgress;
  defaultStudentName: string;
  onBackToDashboard: () => void;
  onBackToAssessment: () => void;
}

export const SertifikatView: React.FC<SertifikatViewProps> = ({
  topic,
  progress,
  defaultStudentName,
  onBackToDashboard,
  onBackToAssessment
}) => {
  const { playClick, playSuccess } = useTheme();

  const assessment = progress.finalAssessment;
  const isAssessmentCompleted = Boolean(assessment);

  const [studentName, setStudentName] = useState(
    assessment?.studentName || defaultStudentName || 'Budi Santoso'
  );
  const [isEditingName, setIsEditingName] = useState(false);

  const finalScore = assessment?.score ?? 0;
  const predicate = assessment?.predicate ?? 'Perlu Bimbingan';
  const dateStr =
    assessment?.dateCompleted ||
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const handlePrint = () => {
    playSuccess();
    window.print();
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Bar (Hidden in print) */}
      <div className="print:hidden flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
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
          Sertifikat Hasil Belajar Resmi
        </span>
      </div>

      {/* Verification Notice */}
      {!isAssessmentCompleted ? (
        <div className="print:hidden p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Asesmen Akhir Belum Dituntaskan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1">
              Sertifikat hanya dapat diterbitkan setelah peserta didik menyelesaikan 10 soal Asesmen Akhir untuk merekam data nilai autentik.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onBackToAssessment();
            }}
            className="px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md"
          >
            Kerjakan Asesmen Akhir Sekarang
          </button>
        </div>
      ) : (
        <>
          {/* Action Tools Bar (Hidden in print) */}
          <div className="print:hidden p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Nama di Sertifikat:</span>
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 text-xs bg-slate-900 text-white rounded-md"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {studentName}
                  </span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-sky-600"
                    title="Ubah Nama"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF (A4 Landscape)</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL HIGH-FIDELITY PRINTABLE CERTIFICATE */}
          <div className="print-certificate-only relative mx-auto w-full aspect-[1.414/1] max-w-4xl bg-white text-slate-900 border-[10px] border-double border-amber-600/70 p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Elegant Background Watermark & Cyber Border Ornaments */}
            <div className="absolute inset-2 border border-amber-500/30 rounded-2xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-sky-100/30 blur-3xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="relative text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={APP_ASSETS.logo}
                  alt="Emblem Resmi SMPN 5 Kroya"
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
                <div className="text-left">
                  <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-800">
                    SMP NEGERI 5 KROYA
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Kecamatan Kroya · Kabupaten Cilacap · Jawa Tengah
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-slate-950 font-serif">
                  SERTIFIKAT HASIL BELAJAR
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-sky-600 mx-auto mt-1 rounded-full" />
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="relative text-center space-y-4 py-4">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                Diberikan kepada peserta didik yang telah menyelesaikan Media Pembelajaran Interaktif:
              </p>
              <div className="text-xs font-bold text-sky-800 uppercase tracking-widest">
                SPENMAKRO SMART INFORMATIKA
              </div>

              {/* Student Name Display */}
              <div className="py-2">
                <span className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-serif border-b-2 border-slate-900 px-8 pb-1 inline-block">
                  {studentName}
                </span>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Kelas {topic.grade} · SMP Negeri 5 Kroya
                </p>
              </div>

              {/* Course Title & Competency */}
              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
                Telah berhasil mempelajari, mempraktikkan simulasi, menyelesaikan tantangan kuis, dan lulus Asesmen Akhir pada materi kompetensi:
              </p>
              <div className="text-base sm:text-lg font-black text-slate-900 bg-slate-50 inline-block px-6 py-1.5 rounded-full border border-slate-200">
                "{topic.title}"
              </div>

              {/* Assessment Grade & Predicate Badge */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="text-center px-4 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Nilai Akhir:</span>
                  <span className="text-xl font-mono font-extrabold text-amber-700">{finalScore} / 100</span>
                </div>

                <div className="text-center px-4 py-1.5 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Predikat:</span>
                  <span className="text-base font-extrabold text-sky-800">{predicate}</span>
                </div>
              </div>
            </div>

            {/* Certificate Footer: Date, Official Seal, Teacher Signature */}
            <div className="relative flex items-end justify-between pt-4 border-t border-slate-200 px-4 text-xs">
              {/* Left: Verification QR / Date */}
              <div className="space-y-1 text-slate-600">
                <div>Diterbitkan di: <strong>Kroya, Cilacap</strong></div>
                <div>Tanggal: <strong>{dateStr}</strong></div>
                <div className="text-[10px] text-slate-400 font-mono mt-2">
                  ID: SPENMAKRO-{topic.grade}-{topic.id.toUpperCase()}-{finalScore}
                </div>
              </div>

              {/* Center: Gold Official Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500/70 p-1 flex items-center justify-center text-amber-700 font-bold text-[9px] text-center uppercase tracking-tight rotate-[-8deg] bg-amber-50/50">
                  <span>RESMI<br />SPENMAKRO<br />INFORMATIKA</span>
                </div>
              </div>

              {/* Right: Teacher Signature */}
              <div className="text-center space-y-1">
                <div className="text-slate-500 text-[11px]">Guru Pengampu Informatika,</div>
                <div className="h-12 flex items-center justify-center font-serif text-slate-800 italic text-sm">
                  (Tertanda Secara Elektronik)
                </div>
                <div className="font-bold text-slate-950 underline text-xs">
                  {APP_ASSETS.teacherName}
                </div>
                <div className="text-[10px] text-slate-500">
                  NIP. {APP_ASSETS.teacherNIP}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav */}
      <div className="print:hidden pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
        >
          Kembali ke Atas
        </button>
      </div>
    </div>
  );
};
