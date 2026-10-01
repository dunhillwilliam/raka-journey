import {
  SessionReport,
  CuriosityItem,
  ParentFeedbackItem,
  MonthlyReportData,
  Artwork,
  UserProfile,
  CompetencyProgressItem
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Raka Daniswara',
  age: 9,
  interests: ['Digital Storytelling', 'Video Editing', 'Creative Design'],
  avatarUrl: '',
  notifications: {
    newSession: true,
    parentFeedback: true,
    monthlyProgress: true
  }
};

export const INITIAL_COMPETENCIES: CompetencyProgressItem[] = [
  {
    id: 'kreativitas',
    name: 'Kreativitas',
    key: 'creativity',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#EF4444' // red/coral
  },
  {
    id: 'critical-thinking',
    name: 'Critical Thinking',
    key: 'criticalThinking',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#F59E0B' // amber/gold
  },
  {
    id: 'komunikasi',
    name: 'Komunikasi',
    key: 'communication',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#3B82F6' // blue
  },
  {
    id: 'digital-skills',
    name: 'Digital Skills',
    key: 'digitalSkills',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#10B981' // emerald
  },
  {
    id: 'kemandirian',
    name: 'Kemandirian',
    key: 'independence',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#8B5CF6' // violet/purple
  }
];

// No dummy data - loaded and synced entirely from Supabase
export const INITIAL_SESSIONS: SessionReport[] = [];

export const INITIAL_CURIOSITY_ITEMS: CuriosityItem[] = [];

export const INITIAL_PARENT_FEEDBACK: ParentFeedbackItem[] = [];

export const INITIAL_ARTWORKS: Artwork[] = [];

export const INITIAL_MONTHLY_REPORT: MonthlyReportData = {
  id: 'month-01',
  month: 'September 2026',
  year: 2026,
  growthStory: '',
  highlights: {
    biggestGrowth: '',
    mostCuriousAbout: '',
    mentorNoticed: '',
    parentNoticed: ''
  },
  recap: {
    totalSessions: 0,
    attendanceRate: 100,
    totalProjects: 0,
    totalQuestions: 0
  },
  targetsNextMonth: []
};
