import React, { useState, useEffect } from 'react';
import { Grade, Topic, ModuleType, StudentProgress } from './types/curriculum';
import { ALL_TOPICS, getTopicsByGrade } from './data/allTopics';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { SettingsModal } from './components/SettingsModal';
import { HeroHomeView } from './components/HeroHomeView';
import { TopicDashboardView } from './components/TopicDashboardView';
import { ApersepsiView } from './components/modules/ApersepsiView';
import { AsesmenAwalView } from './components/modules/AsesmenAwalView';
import { MateriView } from './components/modules/MateriView';
import { SimulasiView } from './components/modules/SimulasiView';
import { MiniGameView } from './components/modules/MiniGameView';
import { KuisView } from './components/modules/KuisView';
import { AsesmenAkhirView } from './components/modules/AsesmenAkhirView';
import { RefleksiView } from './components/modules/RefleksiView';
import { SertifikatView } from './components/modules/SertifikatView';
import { TentangGuruView } from './components/views/TentangGuruView';
import { PetunjukPenggunaanView } from './components/views/PetunjukPenggunaanView';

function MainApp() {
  const { playClick } = useTheme();

  // Navigation states
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'module' | 'teacher' | 'guide'>('home');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(7);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(() => {
    return ALL_TOPICS[0];
  });
  const [activeModule, setActiveModule] = useState<ModuleType>('apersepsi');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [studentName, setStudentName] = useState('Budi Santoso');

  // Multi-topic progress map stored in localStorage
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>(() => {
    try {
      const saved = localStorage.getItem('spenmakro_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem('spenmakro_progress', JSON.stringify(progressMap));
    } catch (e) {}
  }, [progressMap]);

  // Current topic progress
  const currentProgress: StudentProgress = progressMap[selectedTopic.id] || {
    topicId: selectedTopic.id,
    completedModules: []
  };

  const markModuleCompleted = (mod: ModuleType) => {
    setProgressMap((prev) => {
      const existing = prev[selectedTopic.id] || {
        topicId: selectedTopic.id,
        completedModules: []
      };
      if (!existing.completedModules.includes(mod)) {
        return {
          ...prev,
          [selectedTopic.id]: {
            ...existing,
            completedModules: [...existing.completedModules, mod]
          }
        };
      }
      return prev;
    });
  };

  // Handlers
  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    const gradeTopics = getTopicsByGrade(grade);
    if (gradeTopics.length > 0) {
      setSelectedTopic(gradeTopics[0]);
    }
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedGrade(topic.grade);
  };

  const handleStartLearning = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModule = (mod: ModuleType) => {
    setActiveModule(mod);
    setCurrentView('module');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Module sequence advancement
  const moduleSequence: ModuleType[] = [
    'apersepsi',
    'asesmen-awal',
    'materi',
    'simulasi',
    'mini-game',
    'kuis',
    'asesmen-akhir',
    'refleksi',
    'sertifikat'
  ];

  const handleNextModule = () => {
    markModuleCompleted(activeModule);
    const currIdx = moduleSequence.indexOf(activeModule);
    if (currIdx < moduleSequence.length - 1) {
      const nextMod = moduleSequence[currIdx + 1];
      setActiveModule(nextMod);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Universal Sticky Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          playClick();
          if (view === 'home') setCurrentView('home');
          else if (view === 'dashboard') setCurrentView('dashboard');
          else if (view === 'guide') setCurrentView('guide');
          else if (view === 'teacher') setCurrentView('teacher');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTopicTitle={currentView !== 'home' ? selectedTopic.title : undefined}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HeroHomeView
            selectedGrade={selectedGrade}
            onSelectGrade={handleSelectGrade}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
            onStartLearning={handleStartLearning}
            onNavigateGuide={() => {
              setCurrentView('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTeacher={() => {
              setCurrentView('teacher');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <TopicDashboardView
            topic={selectedTopic}
            progress={currentProgress}
            onSelectModule={handleOpenModule}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTeacher={() => {
              setCurrentView('teacher');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateGuide={() => {
              setCurrentView('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'module' && (
          <>
            {activeModule === 'apersepsi' && (
              <ApersepsiView
                topic={selectedTopic}
                progress={currentProgress}
                onSaveHypothesis={(text) => {
                  markModuleCompleted('apersepsi');
                  setProgressMap((prev) => ({
                    ...prev,
                    [selectedTopic.id]: {
                      ...(prev[selectedTopic.id] || { topicId: selectedTopic.id, completedModules: [] }),
                      apersepsiHypothesis: text
                    }
                  }));
                }}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'asesmen-awal' && (
              <AsesmenAwalView
                topic={selectedTopic}
                progress={currentProgress}
                onSaveResult={(res) => {
                  markModuleCompleted('asesmen-awal');
                  setProgressMap((prev) => ({
                    ...prev,
                    [selectedTopic.id]: {
                      ...(prev[selectedTopic.id] || { topicId: selectedTopic.id, completedModules: [] }),
                      diagnosticResults: res
                    }
                  }));
                }}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'materi' && (
              <MateriView
                topic={selectedTopic}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'simulasi' && (
              <SimulasiView
                topic={selectedTopic}
                progress={currentProgress}
                onSaveResult={(simScore) => {
                  markModuleCompleted('simulasi');
                  setProgressMap((prev) => ({
                    ...prev,
                    [selectedTopic.id]: {
                      ...(prev[selectedTopic.id] || { topicId: selectedTopic.id, completedModules: [] }),
                      simulationCompleted: true,
                      simulationScore: simScore
                    }
                  }));
                }}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'mini-game' && (
              <MiniGameView
                topic={selectedTopic}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'kuis' && (
              <KuisView
                topic={selectedTopic}
                progress={currentProgress}
                onSaveQuizScore={(qScore) => {
                  markModuleCompleted('kuis');
                  setProgressMap((prev) => ({
                    ...prev,
                    [selectedTopic.id]: {
                      ...(prev[selectedTopic.id] || { topicId: selectedTopic.id, completedModules: [] }),
                      quizScore: qScore
                    }
                  }));
                }}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'asesmen-akhir' && (
              <AsesmenAkhirView
                topic={selectedTopic}
                progress={currentProgress}
                defaultStudentName={studentName}
                onSaveAssessment={(finalRes) => {
                  markModuleCompleted('asesmen-akhir');
                  setStudentName(finalRes.studentName);
                  setProgressMap((prev) => ({
                    ...prev,
                    [selectedTopic.id]: {
                      ...(prev[selectedTopic.id] || { topicId: selectedTopic.id, completedModules: [] }),
                      finalAssessment: finalRes
                    }
                  }));
                }}
                onGoToCertificate={() => {
                  setActiveModule('sertifikat');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'refleksi' && (
              <RefleksiView
                topic={selectedTopic}
                progress={currentProgress}
                onSaveReflection={(refl) => {
                  markModuleCompleted('refleksi');
                  setProgressMap((prev) => ({
                    ...prev,
                    [selectedTopic.id]: {
                      ...(prev[selectedTopic.id] || { topicId: selectedTopic.id, completedModules: [] }),
                      reflection: refl
                    }
                  }));
                }}
                onNext={handleNextModule}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {activeModule === 'sertifikat' && (
              <SertifikatView
                topic={selectedTopic}
                progress={currentProgress}
                defaultStudentName={studentName}
                onBackToDashboard={() => setCurrentView('dashboard')}
                onBackToAssessment={() => setActiveModule('asesmen-akhir')}
              />
            )}
          </>
        )}

        {currentView === 'teacher' && (
          <TentangGuruView onBackToHome={() => setCurrentView('home')} />
        )}

        {currentView === 'guide' && (
          <PetunjukPenggunaanView onBackToHome={() => setCurrentView('home')} />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="print:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>SPENMAKRO SMART INFORMATIKA</strong> · SMP Negeri 5 Kroya, Cilacap
          </div>
          <div>
            Guru Pengampu: <strong>Muhammad Rif'ani, S.Kom.</strong>
          </div>
          <div className="text-[11px] opacity-75">
            Kurikulum Merdeka Informatika SMP · Hak Cipta Dilindungi
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
