import React, { useState } from 'react';
import { Topic, StudentProgress } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';

interface KuisViewProps {
  topic: Topic;
  progress: StudentProgress;
  onSaveQuizScore: (score: number) => void;
  onNext: () => void;
  onBackToDashboard: () => void;
}

export const KuisView: React.FC<KuisViewProps> = ({
  topic,
  progress,
  onSaveQuizScore,
  onNext,
  onBackToDashboard
}) => {
  const { playClick, playSuccess, playError } = useTheme();
  const questions = topic.kuis;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(progress.quizScore || 0);

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (qId: number, label: string) => {
    if (isFinished) return;
    playClick();
    setUserAnswers((prev) => ({ ...prev, [qId]: label }));
  };

  const handleFinishQuiz = () => {
    if (answeredCount < totalQuestions) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(calculatedScore);
    setIsFinished(true);
    playSuccess();
    onSaveQuizScore(calculatedScore);
  };

  const handleRetry = () => {
    playClick();
    setUserAnswers({});
    setIsFinished(false);
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

        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
          Modul 6 dari 8 · Kuis Interaktif HOTS
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <CheckSquare className="w-4 h-4" />
          <span>Penguatan Pemahaman Soal Bernalar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Kuis Interaktif: {topic.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Selesaikan 10 soal HOTS untuk menguji ketajaman analisismu sebelum masuk ke Asesmen Akhir.
        </p>
      </div>

      {!isFinished ? (
        /* Quiz Active Screen */
        <div className="space-y-6">
          {/* Progress & Question Numbers Strip */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">
                Soal {currentIndex + 1} dari {totalQuestions}
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Terjawab: {answeredCount} / {totalQuestions}
              </span>
            </div>

            {/* Quick jump tabs */}
            <div className="grid grid-cols-10 gap-1.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = userAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`py-1.5 rounded text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
              <div className="inline-block text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                Tingkat: {currentQ.competencyLevel}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.label;

                return (
                  <div
                    key={opt.label}
                    onClick={() => handleSelectOption(currentQ.id, opt.label)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-slate-900 dark:text-white ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
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

            {/* Navigation inside card */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  playClick();
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                &larr; Sebelumnya
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => {
                    playClick();
                    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
                >
                  Berikutnya &rarr;
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  disabled={answeredCount < totalQuestions}
                  className="px-6 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm disabled:opacity-50"
                >
                  Kirim Jawaban Kuis
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Review & Results Screen */
        <div className="space-y-6">
          {/* Result Score Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                  Hasil Kuis Interaktif
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Skor: <span className="text-blue-600 font-mono">{score}</span> / 100
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {score >= 80
                    ? 'Luar biasa! Pemahaman konsep dan analisismu sangat tajam.'
                    : score >= 60
                    ? 'Bagus! Cermati pembahasan di bawah untuk memperbaiki konsep yang masih keliru.'
                    : 'Tetap semangat! Belajar adalah proses bertahap. Pelajari pembahasan di bawah ya!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  onNext();
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md"
              >
                <span>Lanjut ke Asesmen Akhir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Discussion List (Review Semua 10 Soal) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Pembahasan Lengkap Soal Kuis (10 Nomor):</span>
            </h3>

            <div className="space-y-4">
              {questions.map((q, qIdx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-xs text-slate-500 mt-0.5">#{qIdx + 1}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {q.question}
                        </h4>
                      </div>
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Jawabanmu: </span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {userAns || '(Tidak Dijawab)'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Kunci Benar: </span>
                        <span className="font-bold text-emerald-600">{q.correctAnswer}</span>
                      </div>
                    </div>

                    {/* Pembahasan Box */}
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>Pembahasan:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
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
          <span>Lanjut ke Asesmen Akhir</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
