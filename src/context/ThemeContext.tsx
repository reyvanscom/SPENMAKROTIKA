import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeType, DisplayMode } from '../types/curriculum';
import { soundManager } from '../utils/soundSystem';

interface SoundState {
  volume: number; // 0 - 100
  isSilent: boolean;
  isBgmPlaying: boolean;
  currentTrack: number; // 0, 1, 2
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleDisplayMode: () => void;
  soundState: SoundState;
  setVolume: (vol: number) => void;
  toggleSilent: () => void;
  toggleBgm: () => void;
  setBgmTrack: (trackIdx: number) => void;
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playFanfare: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (localStorage.getItem('spenmakro_theme') as ThemeType) || 'tech-blue';
  });

  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    return (localStorage.getItem('spenmakro_display_mode') as DisplayMode) || 'light';
  });

  const [soundState, setSoundState] = useState<SoundState>({
    volume: 70,
    isSilent: false,
    isBgmPlaying: false,
    currentTrack: 0
  });

  useEffect(() => {
    localStorage.setItem('spenmakro_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-tech-blue', 'theme-cyber-purple', 'theme-nature-green');
    root.classList.add(`theme-${theme}`);
    root.setAttribute('data-theme', theme);
    document.body.classList.remove('theme-tech-blue', 'theme-cyber-purple', 'theme-nature-green');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('spenmakro_display_mode', displayMode);
    const root = document.documentElement;
    if (displayMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-mode', 'dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-mode', 'light');
      document.body.classList.remove('dark');
    }
  }, [displayMode]);

  const setTheme = (newTheme: ThemeType) => {
    soundManager.playClick();
    setThemeState(newTheme);
  };

  const setDisplayMode = (mode: DisplayMode) => {
    soundManager.playClick();
    setDisplayModeState(mode);
  };

  const toggleDisplayMode = () => {
    soundManager.playClick();
    setDisplayModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setVolume = (vol: number) => {
    soundManager.setVolume(vol / 100);
    setSoundState((prev) => ({ ...prev, volume: vol }));
  };

  const toggleSilent = () => {
    const nextSilent = !soundState.isSilent;
    soundManager.setMuted(nextSilent);
    if (nextSilent) {
      soundManager.stopBgm();
      setSoundState((prev) => ({ ...prev, isSilent: true, isBgmPlaying: false }));
    } else {
      setSoundState((prev) => ({ ...prev, isSilent: false }));
    }
  };

  const toggleBgm = () => {
    if (soundState.isSilent) {
      toggleSilent();
    }
    const isNowPlaying = soundManager.toggleBgm();
    setSoundState((prev) => ({ ...prev, isBgmPlaying: isNowPlaying }));
  };

  const setBgmTrack = (trackIdx: number) => {
    soundManager.playClick();
    soundManager.setTrack(trackIdx);
    setSoundState((prev) => ({ ...prev, currentTrack: trackIdx }));
  };

  const playClick = () => soundManager.playClick();
  const playSuccess = () => soundManager.playSuccess();
  const playError = () => soundManager.playError();
  const playFanfare = () => soundManager.playFanfare();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        displayMode,
        setDisplayMode,
        toggleDisplayMode,
        soundState,
        setVolume,
        toggleSilent,
        toggleBgm,
        setBgmTrack,
        playClick,
        playSuccess,
        playError,
        playFanfare
      }}
    >
      <div className={`app-theme-root theme-${theme} ${displayMode === 'dark' ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
