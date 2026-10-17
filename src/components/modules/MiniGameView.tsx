import React, { useState, useEffect } from 'react';
import { Topic } from '../../types/curriculum';
import { useTheme } from '../../context/ThemeContext';
import { getTopicGamePack, BattleBotQuestion, WordScrambleQuestion, PictureGuessQuestion } from '../../data/interactiveGamesData';
import { RobotFigure } from './RobotFigure';
import { PictureIllustration } from './PictureIllustration';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Swords,
  Users,
  User,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Shield,
  Zap,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Laptop,
  Tv,
  Wifi,
  Bot,
  Lock,
  Headphones,
  FileText,
  AlertTriangle,
  ShieldCheck,
  LayoutGrid,
  Fingerprint,
  GitBranch,
  Filter,
  Lightbulb,
  Maximize2
} from 'lucide-react';

interface MiniGameViewProps {
  topic: Topic;
  onNext: () => void;
  onBackToDashboard: () => void;
}

type MiniGameType = 'battle-bot' | 'tebak-kata' | 'tebak-gambar';
type GameMode = 'individu' | 'duel' | 'kelompok';

export const MiniGameView: React.FC<MiniGameViewProps> = ({
  topic,
  onNext,
  onBackToDashboard
}) => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();
  const gamePack = getTopicGamePack(topic.id, topic.title, topic.grade);

  // Active game type
  const [activeGame, setActiveGame] = useState<MiniGameType>('battle-bot');
  const [mode, setMode] = useState<GameMode>('individu');

  // ==========================================
  // 1. STATE BATTLE BOT ARENA
  // ==========================================
  const [botQIndex, setBotQIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [botSelectedOption, setBotSelectedOption] = useState<number | null>(null);
  const [botIsAnswered, setBotIsAnswered] = useState(false);
  const [botActionEffect, setBotActionEffect] = useState<'laser' | 'shield' | 'damage' | null>(null);

  // Duel State
  const [duelTurn, setDuelTurn] = useState<'p1' | 'p2'>('p1');
  const [duelP1Hp, setDuelP1Hp] = useState(100);
  const [duelP2Hp, setDuelP2Hp] = useState(100);

  // Kelompok State (Tim Merah vs Tim Biru)
  const [teamTurn, setTeamTurn] = useState<'merah' | 'biru'>('merah');
  const [teamScores, setTeamScores] = useState({ merah: 0, biru: 0 });

  // ==========================================
  // 2. STATE TEBAK KATA
  // ==========================================
  const [wordQIndex, setWordQIndex] = useState(0);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [wordScore, setWordScore] = useState(0);
  const [wordIsCorrect, setWordIsCorrect] = useState<boolean | null>(null);

  // ==========================================
  // 3. STATE TEBAK GAMBAR
  // ==========================================
  const [picQIndex, setPicQIndex] = useState(0);
  const [picRevealedTiles, setPicRevealedTiles] = useState<boolean[]>([false, false, false, false]);
  const [picSelectedOption, setPicSelectedOption] = useState<number | null>(null);
  const [picScore, setPicScore] = useState(0);

  // Reset or initialize when game changes
  const resetAllGames = () => {
    playClick();
    setBotQIndex(0);
    setPlayerHp(100);
    setEnemyHp(100);
    setBotSelectedOption(null);
    setBotIsAnswered(false);
    setDuelTurn('p1');
    setDuelP1Hp(100);
    setDuelP2Hp(100);
    setTeamTurn('merah');
    setTeamScores({ merah: 0, biru: 0 });

    setWordQIndex(0);
    setUserLetters([]);
    setWordScore(0);
    setWordIsCorrect(null);

    setPicQIndex(0);
    setPicRevealedTiles([false, false, false, false]);
    setPicSelectedOption(null);
    setPicScore(0);
  };

  // Helper icons for Picture Guess
  const renderVisualIcon = (iconName: string) => {
    const props = { className: 'w-16 h-16 sm:w-20 sm:h-20 text-sky-500 mx-auto animate-pulse' };
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto" />;
      case 'AlertTriangle': return <AlertTriangle {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mx-auto" />;
      case 'FileText': return <FileText {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-500 mx-auto" />;
      case 'Lock': return <Lock {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto" />;
      case 'Headphones': return <Headphones {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500 mx-auto" />;
      case 'LayoutGrid': return <LayoutGrid {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-sky-500 mx-auto" />;
      case 'Fingerprint': return <Fingerprint {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-500 mx-auto" />;
      case 'GitBranch': return <GitBranch {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto" />;
      case 'Filter': return <Filter {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mx-auto" />;
      case 'Lightbulb': return <Lightbulb {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400 mx-auto" />;
      case 'Laptop': return <Laptop {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-sky-500 mx-auto" />;
      case 'Tv': return <Tv {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-500 mx-auto" />;
      case 'Wifi': return <Wifi {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 mx-auto" />;
      case 'Trophy': return <Trophy {...props} className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mx-auto" />;
      default: return <Bot {...props} />;
    }
  };

  // ==========================================
  // HANDLERS: 1. BATTLE BOT
  // ==========================================
  const currentBotQ = gamePack.battleBot[botQIndex % gamePack.battleBot.length];

  const handleBotAnswer = (optIdx: number) => {
    if (botIsAnswered) return;
    setBotSelectedOption(optIdx);
    setBotIsAnswered(true);

    const isCorrect = optIdx === currentBotQ.correctIndex;

    if (isCorrect) {
      playSuccess();
      setBotActionEffect('laser');

      if (mode === 'individu') {
        setEnemyHp((prev) => Math.max(0, prev - currentBotQ.damage));
      } else if (mode === 'duel') {
        if (duelTurn === 'p1') {
          setDuelP2Hp((prev) => Math.max(0, prev - currentBotQ.damage));
        } else {
          setDuelP1Hp((prev) => Math.max(0, prev - currentBotQ.damage));
        }
      } else if (mode === 'kelompok') {
        setTeamScores((prev) => ({
          ...prev,
          [teamTurn]: prev[teamTurn] + 20
        }));
      }
    } else {
      playError();
      setBotActionEffect('damage');

      if (mode === 'individu') {
        setPlayerHp((prev) => Math.max(0, prev - 20));
      } else if (mode === 'duel') {
        if (duelTurn === 'p1') {
          setDuelP1Hp((prev) => Math.max(0, prev - 15));
        } else {
          setDuelP2Hp((prev) => Math.max(0, prev - 15));
        }
      }
    }

    setTimeout(() => {
      setBotActionEffect(null);
    }, 1200);
  };

  const handleNextBotQuestion = () => {
    playClick();
    if (botQIndex < gamePack.battleBot.length - 1) {
      setBotQIndex((prev) => prev + 1);
      setBotSelectedOption(null);
      setBotIsAnswered(false);

      if (mode === 'duel') {
        setDuelTurn((prev) => (prev === 'p1' ? 'p2' : 'p1'));
      } else if (mode === 'kelompok') {
        setTeamTurn((prev) => (prev === 'merah' ? 'biru' : 'merah'));
      }
    } else {
      // Game Finish
      playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setBotQIndex(gamePack.battleBot.length); // trigger end screen
    }
  };

  // ==========================================
  // HANDLERS: 2. TEBAK KATA
  // ==========================================
  const currentWordQ = gamePack.wordScramble[wordQIndex % gamePack.wordScramble.length];
  const targetWord = currentWordQ.word;
  const availableLetterList = currentWordQ.scrambled.split(' ').filter(Boolean);

  const handleAddLetter = (char: string) => {
    playClick();
    if (userLetters.length < targetWord.length) {
      const next = [...userLetters, char];
      setUserLetters(next);

      if (next.length === targetWord.length) {
        const formedWord = next.join('');
        if (formedWord === targetWord) {
          playSuccess();
          setWordIsCorrect(true);
          setWordScore((prev) => prev + 20);
        } else {
          playError();
          setWordIsCorrect(false);
        }
      }
    }
  };

  const handleBackspaceLetter = () => {
    playClick();
    setUserLetters((prev) => prev.slice(0, -1));
    setWordIsCorrect(null);
  };

  const handleNextWordQuestion = () => {
    playClick();
    if (wordQIndex < gamePack.wordScramble.length - 1) {
      setWordQIndex((prev) => prev + 1);
      setUserLetters([]);
      setWordIsCorrect(null);
    } else {
      playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setWordQIndex(gamePack.wordScramble.length);
    }
  };

  // ==========================================
  // HANDLERS: 3. TEBAK GAMBAR
  // ==========================================
  const currentPicQ = gamePack.pictureGuess[picQIndex % gamePack.pictureGuess.length];

  const handleRevealTile = (idx: number) => {
    playClick();
    setPicRevealedTiles((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const handlePicAnswer = (optIdx: number) => {
    if (picSelectedOption !== null) return;
    setPicSelectedOption(optIdx);

    // reveal all tiles to show full image
    setPicRevealedTiles([true, true, true, true]);

    if (optIdx === currentPicQ.correctIndex) {
      playSuccess();
      setPicScore((prev) => prev + 20);
    } else {
      playError();
    }
  };

  const handleNextPicQuestion = () => {
    playClick();
    if (picQIndex < gamePack.pictureGuess.length - 1) {
      setPicQIndex((prev) => prev + 1);
      setPicRevealedTiles([false, false, false, false]);
      setPicSelectedOption(null);
    } else {
      playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setPicQIndex(gamePack.pictureGuess.length);
    }
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation */}
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

        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
          Modul 5 dari 8 · Mini Game Edukasi
        </span>
      </div>

      {/* Title & Game Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            <span>Arena Mini Game Interaktif IFP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {activeGame === 'battle-bot' && 'Pertarungan Robot Edukasi'}
            {activeGame === 'tebak-kata' && 'Tebak Kata Informatika'}
            {activeGame === 'tebak-gambar' && 'Tebak Gambar & Visual Clue'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            5 Soal Kontekstual Kehidupan Sehari-hari · Mendukung Layar Sentuh IFP & Multi-Player
          </p>
        </div>

        {/* 3 Game Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => {
              playClick();
              setActiveGame('battle-bot');
            }}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeGame === 'battle-bot'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Robot Battle</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveGame('tebak-kata');
            }}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeGame === 'tebak-kata'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tebak Kata</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveGame('tebak-gambar');
            }}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeGame === 'tebak-gambar'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tebak Gambar</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GAME 1: PERTARUNGAN ROBOT EDUKASI                                        */}
      {/* ========================================================================= */}
      {activeGame === 'battle-bot' && (
        <div className="space-y-6">
          {/* Sub-mode selector (Individu, Duel, Kelompok) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Pilihan Mode:</span>
              <button
                onClick={() => {
                  playClick();
                  setMode('individu');
                  resetAllGames();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                  mode === 'individu'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Individu (Solo vs AI)</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setMode('duel');
                  resetAllGames();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                  mode === 'duel'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Duel (2 Pemain di IFP)</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setMode('kelompok');
                  resetAllGames();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                  mode === 'kelompok'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Kelompok (Tim Merah vs Biru)</span>
              </button>
            </div>

            <button
              onClick={resetAllGames}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game</span>
            </button>
          </div>

          {/* ARENA BATTLE CONTAINER */}
          {botQIndex < gamePack.battleBot.length ? (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
              {/* Battle Header Status: Interactive 2D Animated Robots Arena */}
              <div className="grid grid-cols-2 gap-3 sm:gap-8 items-center py-5 px-4 sm:px-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                {/* Robot Kiri (Player 1 / Tim Biru) */}
                <RobotFigure
                  color="blue"
                  name={
                    mode === 'individu'
                      ? 'Robot Pelajar'
                      : mode === 'duel'
                      ? 'Pemain 1'
                      : `Tim Biru (${teamScores.biru} Pts)`
                  }
                  hp={mode === 'individu' ? playerHp : mode === 'duel' ? duelP1Hp : Math.max(0, 100 - teamScores.merah)}
                  isShooting={
                    botActionEffect === 'laser' &&
                    (mode === 'individu' || (mode === 'duel' && duelTurn === 'p1') || (mode === 'kelompok' && teamTurn === 'biru'))
                  }
                  isHit={
                    (botActionEffect === 'damage' && (mode === 'individu' || (mode === 'duel' && duelTurn === 'p1'))) ||
                    (botActionEffect === 'laser' && ((mode === 'duel' && duelTurn === 'p2') || (mode === 'kelompok' && teamTurn === 'merah')))
                  }
                  isDead={
                    (mode === 'individu' && playerHp <= 0) ||
                    (mode === 'duel' && duelP1Hp <= 0) ||
                    (mode === 'kelompok' && teamScores.merah >= 60 && teamScores.merah > teamScores.biru)
                  }
                  isCurrentTurn={mode === 'duel' ? duelTurn === 'p1' : mode === 'kelompok' ? teamTurn === 'biru' : true}
                />

                {/* Robot Kanan (Enemy / Player 2 / Tim Merah) */}
                <RobotFigure
                  color="red"
                  name={
                    mode === 'individu'
                      ? 'Cyber BugBot'
                      : mode === 'duel'
                      ? 'Pemain 2'
                      : `Tim Merah (${teamScores.merah} Pts)`
                  }
                  hp={mode === 'individu' ? enemyHp : mode === 'duel' ? duelP2Hp : Math.max(0, 100 - teamScores.biru)}
                  isShooting={
                    (botActionEffect === 'damage' && mode === 'individu') ||
                    (botActionEffect === 'laser' && ((mode === 'duel' && duelTurn === 'p2') || (mode === 'kelompok' && teamTurn === 'merah')))
                  }
                  isHit={
                    (botActionEffect === 'laser' && (mode === 'individu' || (mode === 'duel' && duelTurn === 'p1') || (mode === 'kelompok' && teamTurn === 'biru'))) ||
                    (botActionEffect === 'damage' && mode === 'duel' && duelTurn === 'p2')
                  }
                  isDead={
                    (mode === 'individu' && enemyHp <= 0) ||
                    (mode === 'duel' && duelP2Hp <= 0) ||
                    (mode === 'kelompok' && teamScores.biru >= 60 && teamScores.biru > teamScores.merah)
                  }
                  isCurrentTurn={mode === 'duel' ? duelTurn === 'p2' : mode === 'kelompok' ? teamTurn === 'merah' : false}
                />
              </div>

              {/* Soal Kehidupan Sehari-hari */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Ronde {botQIndex + 1} dari 5
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Daya Serangan: +{currentBotQ.damage} Poin
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-200 mb-1 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>Situasi Sehari-hari:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                    "{currentBotQ.scenario}"
                  </p>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {currentBotQ.question}
                </h3>
              </div>

              {/* 4 Opsi Jawaban (Ukuran Ramah Layar Sentuh IFP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentBotQ.options.map((opt, idx) => {
                  const isSelected = botSelectedOption === idx;
                  const isCorrect = idx === currentBotQ.correctIndex;

                  let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400';

                  if (botIsAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={botIsAnswered}
                      onClick={() => handleBotAnswer(idx)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-98 min-h-[56px] ${btnStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {opt.label}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Penjelasan Edukatif & Tombol Lanjut Ronde */}
              {botIsAnswered && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">
                      {botSelectedOption === currentBotQ.correctIndex ? '🎉 Serangan Berhasil!' : '🛡️ Serangan Melenceng!'}
                    </strong>
                    {currentBotQ.explanation}
                  </div>

                  <button
                    onClick={handleNextBotQuestion}
                    className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs shrink-0"
                  >
                    <span>{botQIndex < gamePack.battleBot.length - 1 ? 'Ronde Berikutnya' : 'Lihat Hasil Pertarungan'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Layar Selesai Battle Bot
            <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Pertarungan Selesai!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  {mode === 'individu' && 'Robot Siswa berhasil menuntaskan semua 5 ronde pertarungan dan melindungi pengetahuan digital!'}
                  {mode === 'duel' && `Pemenang Duel: ${duelP1Hp > duelP2Hp ? 'Pemain 1 🏆' : duelP2Hp > duelP1Hp ? 'Pemain 2 🏆' : 'Seri! Keduanya Hebat 🤝'}`}
                  {mode === 'kelompok' && `Pemenang Kelas: ${teamScores.biru > teamScores.merah ? 'Tim Biru 🏆' : teamScores.merah > teamScores.biru ? 'Tim Merah 🏆' : 'Imbang!'}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={resetAllGames}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Main Lagi</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveGame('tebak-kata');
                    resetAllGames();
                  }}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md flex items-center gap-2"
                >
                  <span>Coba Mini Game Tebak Kata</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 2: TEBAK KATA INFORMATIKA                                            */}
      {/* ========================================================================= */}
      {activeGame === 'tebak-kata' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          {wordQIndex < gamePack.wordScramble.length ? (
            <>
              {/* Header Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                    Soal {wordQIndex + 1} dari 5
                  </span>
                  <span className="text-xs text-slate-500">Skor Terkumpul: {wordScore} Poin</span>
                </div>

                <button
                  onClick={resetAllGames}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Petunjuk Kontekstual Sehari-hari */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-1">
                <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  <span>Petunjuk Sehari-hari:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  "{currentWordQ.dailyContext}"
                </p>
                <p className="text-xs text-slate-500 italic mt-1">
                  Petunjuk Tambahan: {currentWordQ.clue} ({targetWord.length} Huruf)
                </p>
              </div>

              {/* Kotak Huruf Jawaban Terisi */}
              <div className="py-4 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: targetWord.length }).map((_, i) => {
                    const char = userLetters[i];
                    return (
                      <div
                        key={i}
                        className={`w-11 h-12 sm:w-14 sm:h-16 rounded-xl border-2 flex items-center justify-center text-lg sm:text-2xl font-black font-mono transition-all ${
                          char
                            ? wordIsCorrect === true
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : wordIsCorrect === false
                              ? 'border-rose-500 bg-rose-50 text-rose-700'
                              : 'border-purple-500 bg-purple-50/50 text-purple-900 dark:text-white'
                            : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        {char || ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pilihan Tombol Huruf Sentuh (Keyboard Sentuh Ramah IFP) */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-center text-slate-500 uppercase tracking-wider">
                  Sentuh Huruf di Bawah Ini untuk Menyusun Kata:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {availableLetterList.map((letter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddLetter(letter)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-purple-500 text-base sm:text-xl font-bold font-mono text-slate-800 dark:text-slate-100 shadow-sm active:scale-95 transition-transform"
                    >
                      {letter}
                    </button>
                  ))}

                  <button
                    onClick={handleBackspaceLetter}
                    className="px-4 h-12 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Status & Next Button */}
              {wordIsCorrect !== null && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    {wordIsCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Tepat Sekali! Jawabannya adalah: {targetWord} (+20 Poin)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Belum tepat! Coba hapus dan susun kembali.
                      </span>
                    )}
                  </div>

                  {wordIsCorrect && (
                    <button
                      onClick={handleNextWordQuestion}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2"
                    >
                      <span>Soal Berikutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            // Layar Selesai Tebak Kata
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Hebat! 5 Kata Berhasil Ditebak
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Skor Akhir Tebak Kata: <strong>{wordScore} / 100 Poin</strong>
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetAllGames}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Ulangi
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveGame('tebak-gambar');
                    resetAllGames();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <span>Lanjut Tebak Gambar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME 3: TEBAK GAMBAR & VISUAL CLUE                                       */}
      {/* ========================================================================= */}
      {activeGame === 'tebak-gambar' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
          {picQIndex < gamePack.pictureGuess.length ? (
            <>
              {/* Header Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                    Tantangan Gambar {picQIndex + 1} dari 5
                  </span>
                  <span className="text-xs text-slate-500">Skor: {picScore} Poin</span>
                </div>

                <button
                  onClick={resetAllGames}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Kotak Visual Gambar Misterius (4 Ubin Sentuh Buka Gambar IFP) */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-center text-slate-500">
                  Ketuk Ubin Tertutup untuk Membuka Petunjuk Gambar:
                </p>

                <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-4 border-purple-500/50 bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-lg flex items-center justify-center p-3">
                  {/* Ilustrasi Murni 2D Gambar Tanpa Ikon dan Tanpa Teks */}
                  <div className="w-full h-full flex items-center justify-center">
                    <PictureIllustration
                      answerKey={currentPicQ.options[currentPicQ.correctIndex]}
                      iconName={currentPicQ.iconName}
                      title={currentPicQ.title}
                    />
                  </div>

                  {/* 4 Ubin Penutup (Bisa dibuka dengan sentuhan di IFP) */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 pointer-events-auto">
                    {[0, 1, 2, 3].map((tileIdx) => (
                      <button
                        key={tileIdx}
                        disabled={picRevealedTiles[tileIdx]}
                        onClick={() => handleRevealTile(tileIdx)}
                        className={`w-full h-full rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                          picRevealedTiles[tileIdx]
                            ? 'opacity-0 pointer-events-none'
                            : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white hover:brightness-110 shadow-md active:scale-95'
                        }`}
                      >
                        <span>Buka {tileIdx + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Petunjuk Kontekstual */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-center">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  "{currentPicQ.dailyContext}"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Petunjuk: {currentPicQ.clue}
                </p>
              </div>

              {/* 4 Opsi Jawaban Tebak Gambar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentPicQ.options.map((optText, idx) => {
                  const isSelected = picSelectedOption === idx;
                  const isCorrect = idx === currentPicQ.correctIndex;

                  let style = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-500';

                  if (picSelectedOption !== null) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected) {
                      style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={picSelectedOption !== null}
                      onClick={() => handlePicAnswer(idx)}
                      className={`p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all min-h-[50px] active:scale-98 ${style}`}
                    >
                      {optText}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Tombol Berikutnya */}
              {picSelectedOption !== null && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 animate-in fade-in">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {picSelectedOption === currentPicQ.correctIndex ? '🎉 Tebakanmu Tepat! (+20 Poin)' : '❌ Tebakan Kurang Tepat!'}
                  </span>

                  <button
                    onClick={handleNextPicQuestion}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2"
                  >
                    <span>{picQIndex < gamePack.pictureGuess.length - 1 ? 'Gambar Berikutnya' : 'Lihat Skor Akhir'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Layar Selesai Tebak Gambar
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Semua Gambar Berhasil Dipecahkan!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Skor Tebak Gambar: <strong>{picScore} / 100 Poin</strong>
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetAllGames}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Ulangi
                </button>
                <button
                  onClick={() => {
                    playClick();
                    onNext();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <span>Lanjut ke Kuis Interaktif</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Nav Action */}
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
          className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition-colors"
        >
          <span>Lanjut ke Kuis Interaktif</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
