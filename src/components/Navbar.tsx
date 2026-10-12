import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Volume2, VolumeX, Moon, Sun, Home, BookOpen, HelpCircle, User } from 'lucide-react';
import { APP_ASSETS } from '../constants/assets';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSettings: () => void;
  activeTopicTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSettings,
  activeTopicTitle
}) => {
  const { theme, setTheme, displayMode, setDisplayMode, soundState, toggleSilent, playClick } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-white/90 border-slate-200 dark:bg-slate-950/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg group"
        >
          <img
            src={APP_ASSETS.logo}
            alt="Logo Resmi SMPN 5 Kroya"
            referrerPolicy="no-referrer"
            className="w-11 h-11 object-contain drop-shadow-md group-hover:scale-105 transition-all duration-200 shrink-0 select-none"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              SPENMAKRO SMART INFORMATIKA
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              SMP Negeri 5 Kroya
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'home'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          {activeTopicTitle && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'dashboard'
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Menu Materi</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('guide')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'guide'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Petunjuk</span>
          </button>

          <button
            onClick={() => onNavigate('teacher')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'teacher'
                ? 'text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <img
              src={APP_ASSETS.teacherPhotoReal}
              alt="Avatar Guru"
              className="w-4 h-4 rounded-full object-cover border border-sky-400/50"
            />
            <span>Tentang Guru</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleSilent}
            title={soundState.isSilent ? 'Suara Hening (Muted)' : 'Suara Aktif'}
            aria-label="Toggle Silent Mode"
            className={`p-2 rounded-lg border transition-colors ${
              soundState.isSilent
                ? 'border-amber-300 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-400'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {soundState.isSilent ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pilihan Tema Warna Cepat */}
          <div className="hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80" title="Pilihan Tema Warna">
            <button
              onClick={() => {
                playClick();
                setTheme('tech-blue');
              }}
              title="Tema Tech Blue"
              aria-label="Tema Tech Blue"
              className={`w-5 h-5 rounded-full bg-sky-500 transition-all ${
                theme === 'tech-blue' ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 scale-110 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
            />
            <button
              onClick={() => {
                playClick();
                setTheme('cyber-purple');
              }}
              title="Tema Cyber Purple"
              aria-label="Tema Cyber Purple"
              className={`w-5 h-5 rounded-full bg-purple-600 transition-all ${
                theme === 'cyber-purple' ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 scale-110 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
            />
            <button
              onClick={() => {
                playClick();
                setTheme('nature-green');
              }}
              title="Tema Nature Green"
              aria-label="Tema Nature Green"
              className={`w-5 h-5 rounded-full bg-emerald-600 transition-all ${
                theme === 'nature-green' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 scale-110 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
            />
          </div>

          {/* Pilihan Tema Terang & Tema Gelap */}
          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs shadow-xs">
            <button
              onClick={() => {
                playClick();
                setDisplayMode('light');
              }}
              title="Aktifkan Tema Terang"
              aria-label="Mode Terang"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                displayMode === 'light'
                  ? 'bg-white text-amber-600 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Terang</span>
            </button>
            <button
              onClick={() => {
                playClick();
                setDisplayMode('dark');
              }}
              title="Aktifkan Tema Gelap"
              aria-label="Mode Gelap"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                displayMode === 'dark'
                  ? 'bg-slate-800 text-sky-400 font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Gelap</span>
            </button>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Pengaturan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
