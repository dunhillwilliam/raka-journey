import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SessionReport,
  CuriosityItem,
  ParentFeedbackItem,
  MonthlyReportData,
  Artwork,
  UserProfile,
  CompetencyProgressItem,
  CloudConfig
} from '../types';
import { INITIAL_COMPETENCIES } from '../lib/initialData';
import {
  getSessions,
  saveSessionToDb,
  getCuriosityList,
  saveCuriosityToDb,
  getParentFeedbacks,
  saveParentFeedbackToDb,
  getArtworksList,
  saveArtworkToDb,
  saveUserProfile,
  getStoredSupabaseConfig,
  setCustomSupabaseCredentials,
  testSupabaseConnection
} from '../lib/supabase';
import {
  getStoredR2Config,
  saveR2Config,
  uploadFileToR2
} from '../lib/cloudflareR2';

export type NavTab =
  | 'beranda'
  | 'daily-report'
  | 'progress'
  | 'curiosity'
  | 'parent-corner'
  | 'monthly-report'
  | 'galeri-karya'
  | 'pengaturan';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  sessions: SessionReport[];
  currentSession: SessionReport | null;
  selectSession: (sessionId: string) => void;
  addSession: (session: Omit<SessionReport, 'id' | 'scores'>) => Promise<void>;
  updateSession: (session: SessionReport) => Promise<void>;

  competencies: CompetencyProgressItem[];
  curiosityItems: CuriosityItem[];
  addCuriosityItem: (item: Omit<CuriosityItem, 'id' | 'date' | 'formattedDate'>) => Promise<void>;

  parentFeedbacks: ParentFeedbackItem[];
  addParentFeedback: (feedback: Omit<ParentFeedbackItem, 'id' | 'date'>) => Promise<void>;
  toggleFeedbackChecklist: (feedbackId: string, checkId: string) => void;

  monthlyReport: MonthlyReportData;
  toggleMonthlyTarget: (targetId: string) => void;

  artworks: Artwork[];
  uploadArtwork: (file: File, title: string, category: Artwork['category'], description?: string) => Promise<{ success: boolean; error?: string }>;

  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  cloudConfig: CloudConfig;
  updateCloudConfig: (supabaseUrl: string, supabaseAnonKey: string, r2AccountId: string, r2Bucket: string, r2PublicUrl: string) => Promise<boolean>;

  isNewSessionModalOpen: boolean;
  setIsNewSessionModalOpen: (open: boolean) => void;
  isNewCuriosityModalOpen: boolean;
  setIsNewCuriosityModalOpen: (open: boolean) => void;
  isNewFeedbackModalOpen: boolean;
  setIsNewFeedbackModalOpen: (open: boolean) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isPdfPreviewOpen: boolean;
  setIsPdfPreviewOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  refreshData: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [sessions, setSessions] = useState<SessionReport[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [curiosityItems, setCuriosityItems] = useState<CuriosityItem[]>([]);
  const [parentFeedbacks, setParentFeedbacks] = useState<ParentFeedbackItem[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportData>({
    id: '',
    month: '',
    year: new Date().getFullYear(),
    growthStory: '',
    highlights: { biggestGrowth: '', mostCuriousAbout: '', mentorNoticed: '', parentNoticed: '' },
    recap: { totalSessions: 0, attendanceRate: 100, totalProjects: 0, totalQuestions: 0 },
    targetsNextMonth: []
  });
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    interests: [],
    avatarUrl: '',
    notifications: { newSession: true, parentFeedback: true, monthlyProgress: true }
  });

  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    supabaseUrl: '',
    supabaseAnonKey: '',
    isSupabaseConnected: false,
    cfAccountId: '',
    cfBucketName: 'raka-learning-assets',
    cfPublicUrl: '',
    isR2Configured: false
  });

  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isNewCuriosityModalOpen, setIsNewCuriosityModalOpen] = useState(false);
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          loadedSessions,
          loadedCuriosity,
          loadedFeedbacks,
          loadedArtworks,
        ] = await Promise.all([
          getSessions(),
          getCuriosityList(),
          getParentFeedbacks(),
          getArtworksList(),
        ]);

        setSessions(loadedSessions);
        if (loadedSessions.length > 0) {
          setCurrentSessionId(loadedSessions[0].id);
        }
        setCuriosityItems(loadedCuriosity);
        setParentFeedbacks(loadedFeedbacks);
        setArtworks(loadedArtworks);

        const sbConfig = getStoredSupabaseConfig();
        const r2Config = getStoredR2Config();

        const isSbSet = Boolean(sbConfig.url && sbConfig.anonKey && !sbConfig.url.includes('your-project'));
        let sbConnected = false;
        if (isSbSet) {
          const test = await testSupabaseConnection(sbConfig.url, sbConfig.anonKey);
          sbConnected = test.success;
        }

        setCloudConfig({
          supabaseUrl: sbConfig.url,
          supabaseAnonKey: sbConfig.anonKey,
          isSupabaseConnected: sbConnected,
          cfAccountId: r2Config.accountId,
          cfBucketName: r2Config.bucketName || 'raka-learning-assets',
          cfPublicUrl: r2Config.publicUrl,
          isR2Configured: Boolean(r2Config.accountId || r2Config.publicUrl)
        });
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || (sessions.length > 0 ? sessions[0] : null);

  const competencies: CompetencyProgressItem[] = INITIAL_COMPETENCIES.map(comp => {
    if (sessions.length === 0) {
      return {
        ...comp,
        currentScore: 0,
        initialScore: 0,
        delta: 0
      };
    }

    const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
    const firstScore = sorted[0].scores[comp.key] || 0;
    const latestScore = sorted[sorted.length - 1].scores[comp.key] || 0;
    const delta = latestScore - firstScore;

    return {
      ...comp,
      currentScore: latestScore,
      initialScore: firstScore,
      delta
    };
  });

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const addSession = async (sessionData: Omit<SessionReport, 'id' | 'scores'>) => {
    const newId = `sesi-${String(sessionData.sessionNumber).padStart(2, '0')}`;
    const newSession: SessionReport = {
      ...sessionData,
      id: newId,
      scores: {
        creativity: 0,
        criticalThinking: 0,
        communication: 0,
        digitalSkills: 0,
        independence: 0
      }
    };

    const updated = [newSession, ...sessions.filter(s => s.id !== newId)];
    setSessions(updated);
    setCurrentSessionId(newId);
    await saveSessionToDb(newSession);

    if (sessionData.curiosity?.question) {
      const newCuriosity: CuriosityItem = {
        id: `curiosity-${Date.now()}`,
        question: sessionData.curiosity.question,
        topic: sessionData.curiosity.category || 'Belajar Digital',
        date: sessionData.date,
        formattedDate: sessionData.formattedDate,
        level: sessionData.curiosity.level || 'Sedang',
        status: 'Dibahas',
        answeredInSession: sessionData.sessionNumber
      };
      setCuriosityItems(prev => [newCuriosity, ...prev]);
      await saveCuriosityToDb(newCuriosity);
    }
  };

  const updateSession = async (updatedSession: SessionReport) => {
    const updated = sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    setSessions(updated);
    await saveSessionToDb(updatedSession);
  };

  const addCuriosityItem = async (item: Omit<CuriosityItem, 'id' | 'date' | 'formattedDate'>) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const formatted = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const newItem: CuriosityItem = {
      ...item,
      id: `curiosity-${Date.now()}`,
      date: dateStr,
      formattedDate: formatted
    };

    const updated = [newItem, ...curiosityItems];
    setCuriosityItems(updated);
    await saveCuriosityToDb(newItem);
  };

  const addParentFeedback = async (feedback: Omit<ParentFeedbackItem, 'id' | 'date'>) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const newFeedback: ParentFeedbackItem = {
      ...feedback,
      id: `parent-fb-${Date.now()}`,
      date: dateStr
    };

    const updated = [newFeedback, ...parentFeedbacks];
    setParentFeedbacks(updated);
    await saveParentFeedbackToDb(newFeedback);
  };

  const toggleFeedbackChecklist = async (feedbackId: string, checkId: string) => {
    const updated = parentFeedbacks.map(f => {
      if (f.id === feedbackId) {
        return {
          ...f,
          checklist: f.checklist.map(c => c.id === checkId ? { ...c, checked: !c.checked } : c)
        };
      }
      return f;
    });
    setParentFeedbacks(updated);
    const target = updated.find(f => f.id === feedbackId);
    if (target) await saveParentFeedbackToDb(target);
  };

  const toggleMonthlyTarget = (targetId: string) => {
    setMonthlyReport(prev => ({
      ...prev,
      targetsNextMonth: prev.targetsNextMonth.map(t =>
        t.id === targetId ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  const uploadArtwork = async (
    file: File,
    title: string,
    category: Artwork['category'],
    description?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const uploadRes = await uploadFileToR2(file, category);
      if (!uploadRes.success) {
        return { success: false, error: uploadRes.error || 'Upload gagal' };
      }

      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const formatted = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      const newArt: Artwork = {
        id: `art-${Date.now()}`,
        title,
        category,
        date: dateStr,
        formattedDate: formatted,
        duration: category === 'Video' ? '01:00' : undefined,
        thumbnailUrl: uploadRes.fileUrl,
        fileUrl: uploadRes.fileUrl,
        fileSize: uploadRes.fileSizeFormatted,
        storageProvider: 'cloudflare_r2',
        r2Bucket: uploadRes.bucket,
        r2Key: uploadRes.storageKey,
        description: description || ''
      };

      const updated = [newArt, ...artworks];
      setArtworks(updated);
      await saveArtworkToDb(newArt);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...profile };
      saveUserProfile(updated);
      return updated;
    });
  };

  const updateCloudConfig = async (
    supabaseUrl: string,
    supabaseAnonKey: string,
    r2AccountId: string,
    r2Bucket: string,
    r2PublicUrl: string
  ): Promise<boolean> => {
    setCustomSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    saveR2Config({
      accountId: r2AccountId,
      bucketName: r2Bucket,
      publicUrl: r2PublicUrl
    });

    let isSbConnected = false;
    if (supabaseUrl && supabaseAnonKey) {
      const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
      isSbConnected = res.success;
    }

    setCloudConfig({
      supabaseUrl,
      supabaseAnonKey,
      isSupabaseConnected: isSbConnected,
      cfAccountId: r2AccountId,
      cfBucketName: r2Bucket || 'raka-learning-assets',
      cfPublicUrl: r2PublicUrl,
      isR2Configured: Boolean(r2AccountId || r2PublicUrl)
    });

    try {
      const [loadedSessions, loadedCuriosity, loadedFeedbacks, loadedArtworks] = await Promise.all([
        getSessions(),
        getCuriosityList(),
        getParentFeedbacks(),
        getArtworksList(),
      ]);
      setSessions(loadedSessions);
      if (loadedSessions.length > 0) setCurrentSessionId(loadedSessions[0].id);
      setCuriosityItems(loadedCuriosity);
      setParentFeedbacks(loadedFeedbacks);
      setArtworks(loadedArtworks);
    } catch (e) {
      console.warn('Error reloading data with updated credentials:', e);
    }

    return true;
  };

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sessions,
        currentSession,
        selectSession,
        addSession,
        updateSession,
        competencies,
        curiosityItems,
        addCuriosityItem,
        parentFeedbacks,
        addParentFeedback,
        toggleFeedbackChecklist,
        monthlyReport,
        toggleMonthlyTarget,
        artworks,
        uploadArtwork,
        userProfile,
        updateUserProfile,
        cloudConfig,
        updateCloudConfig,
        isNewSessionModalOpen,
        setIsNewSessionModalOpen,
        isNewCuriosityModalOpen,
        setIsNewCuriosityModalOpen,
        isNewFeedbackModalOpen,
        setIsNewFeedbackModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isPdfPreviewOpen,
        setIsPdfPreviewOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        refreshData,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}