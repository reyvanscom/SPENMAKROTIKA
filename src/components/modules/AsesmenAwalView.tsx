import React, { useState } from 'react';
import { Topic, StudentProgress } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import {
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface AsesmenAwalViewProps {
  topic: Topic;
  progress: StudentProgress;
  onSaveResult: (result: {
    score: number;
    answers: Record<number, string>;
    masteredConcepts: string[];
    reviewNeeded: string[];
  }) => void;
  onNext: () => void;
  onBackToDashboard: () => void;
}

export const AsesmenAwalView: React.FC<AsesmenAwalViewProps> = ({
  topic,
  progress,
  onSaveResult,
  onNext,
  onBackToDashboard
}) => {
  const { playClick, playSuccess, playError } = useTheme();
  const questions = topic.asesmenAwal;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    progress.diagnosticResults?.answers || {}
  );
  const [isSubmitted, setIsSubmitted] = useState(Boolean(progress.diagnosticResults));

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (qId: number, label: string) => {
    if (isSubmitted) return;
    playClick();
    setSelectedAnswers((prev) => ({ ...prev, [qId]: label }));
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) return;

    let correctCount = 0;
    const mastered: string[] = [];
    const review: string[] = [];

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
        mastered.push(q.conceptTag);
      } else {
        review.push(`${q.conceptTag}: ${q.recommendation}`);
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    playSuccess();
    setIsSubmitted(true);

    onSaveResult({
      score,
      answers: selectedAnswers,
      masteredConcepts: mastered,
      reviewNeeded: review
    });
  };

  const handleReset = () => {
    playClick();
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Bar */}
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

        <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
          Modul 2 dari 8 · Asesmen Diagnostik Awal
        </span>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
          <FileQuestion className="w-4 h-4" />
          <span>Pemetaan Kemampuan Awal Peserta Didik</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Asesmen Awal: {topic.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Jawab 5 soal pemantik untuk melihat konsep mana yang sudah kamu kuasai dan bagian mana yang perlu mendapat perhatian lebih.
        </p>
      </div>

      {!isSubmitted ? (
        /* Quiz Interactive Mode */
        <div className="space-y-6">
          {/* Progress Tracker & Question Badges */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">
                Soal {currentIndex + 1} dari {totalQuestions}
              </span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">
                Terjawab: {answeredCount} / {totalQuestions}
              </span>
            </div>

            {/* Question Quick Jump Badges */}
            <div className="flex items-center gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-sky-600 text-white shadow-xs'
                        : hasAnswer
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="inline-block text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Fokus Konsep: {currentQ.conceptTag}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.label;

                return (
                  <div
                    key={opt.label}
                    onClick={() => handleSelectOption(currentQ.id, opt.label)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-slate-900 dark:text-white ring-1 ring-sky-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal pt-0.5">
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Prev / Next Navigation in Question Card */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  playClick();
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr; Soal Sebelumnya
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => {
                    playClick();
                    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white transition-colors"
                >
                  Soal Berikutnya &rarr;
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < totalQuestions}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Kirim Jawaban Asesmen Awal
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Diagnostic Friendly Summary Report */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ringkasan Diagnostik Awal Belajar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nilai awal ini adalah pemandu belajar mandirimu, bukan nilai akhir kelulusan.
                </p>
              </div>
            </div>

            {/* Mastered vs Review Needed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Konsep yang Sudah Dipahami */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konsep yang Sudah Kamu Pahami:</span>
                </div>
                {progress.diagnosticResults?.masteredConcepts.length ? (
                  <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                    {progress.diagnosticResults.masteredConcepts.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Belum ada konsep yang terjawab benar. Tenang saja, materi lengkap siap membantumu!
                  </p>
                )}
              </div>

              {/* Konsep yang Perlu Mendapat Perhatian Lebih */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>Rekomendasi Bagian Perhatian Khusus:</span>
                </div>
                {progress.diagnosticResults?.reviewNeeded.length ? (
                  <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                    {progress.diagnosticResults.reviewNeeded.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                    Luar biasa! Seluruh konsep awal berhasil kamu jawab dengan tepat.
                  </p>
                )}
              </div>
            </div>

            {/* Growth Mindset Note */}
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
              <strong>Catatan Guru Rif'ani:</strong> "Asesmen diagnostik bukanlah ujian akhir. Setiap kesalahan pemahaman awal adalah kompas terbaik untuk menunjukkan bagian materi mana yang perlu kita teliti lebih dalam. Mari kita pelajari materinya bersama-sama!"
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Asesmen Awal</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onNext();
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lanjut ke Materi Pembelajaran</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
