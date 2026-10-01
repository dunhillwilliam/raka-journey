export type UserRole = 'mentor' | 'parent' | 'student';

export interface CompetencyScore {
  creativity: number;
  criticalThinking: number;
  communication: number;
  digitalSkills: number;
  independence: number;
  problemSolving?: number;
  curiosity?: number;
}

export interface CompetencyProgressItem {
  id: string;
  name: string;
  key: keyof CompetencyScore;
  currentScore: number; // e.g. 85
  initialScore: number; // e.g. 68
  delta: number;        // e.g. +18
  color: string;
}

export interface SessionReport {
  id: string;
  sessionNumber: number; // e.g. 4
  date: string;          // e.g. "2026-09-30"
  formattedDate: string; // e.g. "30 September 2026"
  title: string;         // e.g. "Digital Storytelling & Video Editing"
  durationMinutes: number; // e.g. 60
  format: 'Online' | 'Offline' | 'Hybrid';
  mentorName: string;    // e.g. "Kak Sabina"
  
  // Section 1: Apa yang Dipelajari Hari Ini
  topicsLearned: { id: string; text: string; completed: boolean }[];
  
  // Section 2: Apa yang Membuat Raka Penasaran
  curiosity: {
    question: string;
    category: string;
    level: 'Tinggi' | 'Sedang' | 'Rendah';
  };
  
  // Section 3: Observasi Mentor
  mentorObservation: {
    notes: string;
    strengths: string[];
    areasForDevelopment: string[];
  };
  
  // Section 4: Hasil / Aktivitas Belajar
  activities: {
    thumbnailUrl?: string;
    tasks: { id: string; text: string; completed: boolean }[];
  };
  
  // Section 5: Feedback Orang Tua
  parentFeedback: {
    quote: string;
    parentName: string;
    date: string;
  };
  
  // Section 6: Rencana Sesi Berikutnya
  nextSessionPlan: string[];

  // Competency evaluation for this session
  scores: CompetencyScore;
}

export interface CuriosityItem {
  id: string;
  question: string;
  date: string;
  formattedDate: string;
  topic: string;
  level: 'Tinggi' | 'Sedang' | 'Rendah';
  status: 'Baru' | 'Dibahas' | 'Eksplorasi';
  answeredInSession?: number;
}

export interface ParentFeedbackItem {
  id: string;
  weekName: string;      // e.g. "Minggu 4 (26 Sep – 2 Okt 2026)"
  weekNumber: number;    // 1, 2, 3, 4
  date: string;
  engagementRate: number;// e.g. 88
  checklist: {
    id: string;
    text: string;
    checked: boolean;
  }[];
  parentNote: string;
  developmentTarget: string;
}

export interface MonthlyReportData {
  id: string;
  month: string;         // e.g. "September 2026"
  year: number;
  growthStory: string;
  highlights: {
    biggestGrowth: string;
    mostCuriousAbout: string;
    mentorNoticed: string;
    parentNoticed: string;
  };
  recap: {
    totalSessions: number;
    attendanceRate: number; // e.g. 100
    totalProjects: number;  // e.g. 5
    totalQuestions: number; // e.g. 12
  };
  targetsNextMonth: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface Artwork {
  id: string;
  title: string;
  category: 'Video' | 'Presentasi' | 'Desain' | 'Proyek' | 'Riset';
  date: string;
  formattedDate: string;
  duration?: string;      // e.g. "01:24"
  thumbnailUrl: string;
  fileUrl?: string;
  fileSize?: string;
  storageProvider?: 'cloudflare_r2' | 'local_storage' | string;
  r2Bucket?: string;
  r2Key?: string;
  description?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  interests: string[];
  avatarUrl?: string;
  notifications: {
    newSession: boolean;
    parentFeedback: boolean;
    monthlyProgress: boolean;
  };
}

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConnected: boolean;
  cfAccountId: string;
  cfBucketName: string;
  cfPublicUrl: string;
  isR2Configured: boolean;
}
