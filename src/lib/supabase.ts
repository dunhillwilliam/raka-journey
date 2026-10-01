import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SessionReport, CuriosityItem, ParentFeedbackItem, MonthlyReportData, Artwork, UserProfile } from '../types';
import {
  INITIAL_SESSIONS,
  INITIAL_CURIOSITY_ITEMS,
  INITIAL_PARENT_FEEDBACK,
  INITIAL_MONTHLY_REPORT,
  INITIAL_ARTWORKS,
  INITIAL_USER_PROFILE
} from './initialData';

const STORAGE_KEYS = {
  SUPABASE_URL: 'raka_supabase_url',
  SUPABASE_ANON_KEY: 'raka_supabase_anon_key',
  SESSIONS: 'raka_local_sessions',
  CURIOSITY: 'raka_local_curiosity',
  PARENT_FEEDBACK: 'raka_local_parent_feedback',
  MONTHLY_REPORT: 'raka_local_monthly_report',
  ARTWORKS: 'raka_local_artworks',
  USER_PROFILE: 'raka_local_user_profile'
};

// Retrieve configured or env credentials
export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || '' : '';

  return {
    url: storedUrl || envUrl,
    anonKey: storedKey || envKey
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey || url.includes('your-project') || anonKey.includes('your-anon-key')) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function setCustomSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
    supabaseInstance = null; // reset instance
  }
}

export function clearCustomSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
    supabaseInstance = null;
  }
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const testUrl = url || getStoredSupabaseConfig().url;
    const testKey = anonKey || getStoredSupabaseConfig().anonKey;

    if (!testUrl || !testKey || testUrl.includes('your-project')) {
      return { success: false, message: 'URL Supabase atau Anon Key belum dimasukkan.' };
    }

    const testClient = createClient(testUrl, testKey);
    const { error } = await testClient.from('sessions').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message.includes('relation "sessions" does not exist') ||
        error.message.includes('schema cache') ||
        error.message.includes('table')
      ) {
        return {
          success: true,
          message: 'Terhubung ke Supabase! Perlu menjalankan skrip SQL migration untuk membuat tabel.'
        };
      }
      return { success: false, message: `Error Supabase: ${error.message}` };
    }

    return { success: true, message: 'Koneksi ke database Supabase berhasil aktif!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Gagal terhubung: ${msg}` };
  }
}

// -------------------------------------------------------------
// Data Access Methods (Direct Supabase with Local Cache)
// -------------------------------------------------------------

export async function getSessions(): Promise<SessionReport[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('sessions')
        .select('*')
        .order('session_number', { ascending: false });

      if (!error && data) {
        const loaded = data.map(row => ({
          id: row.id,
          sessionNumber: row.session_number,
          date: row.date,
          formattedDate: row.formatted_date,
          title: row.title,
          durationMinutes: row.duration_minutes,
          format: row.format,
          mentorName: row.mentor_name,
          topicsLearned: row.topics_learned || [],
          curiosity: row.curiosity || { question: '', category: '', level: 'Sedang' },
          mentorObservation: row.mentor_observation || { notes: '', strengths: [], areasForDevelopment: [] },
          activities: row.activities || { tasks: [] },
          parentFeedback: row.parent_feedback || { quote: '', parentName: '', date: '' },
          nextSessionPlan: row.next_session_plan || [],
          scores: row.scores || { creativity: 80, criticalThinking: 75, communication: 75, digitalSkills: 80, independence: 70 }
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (e) {
      console.warn('Falling back to local data for sessions:', e);
    }
  }

  // LocalStorage Fallback (cached real sessions)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return INITIAL_SESSIONS; // empty array []
}

export async function saveSessionToDb(session: SessionReport): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const current = await getSessions();
      const existingIdx = current.findIndex(s => s.id === session.id);
      let updated: SessionReport[];
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = session;
      } else {
        updated = [session, ...current];
      }
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    } catch {}
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const dbRow = {
        id: session.id,
        session_number: session.sessionNumber,
        date: session.date,
        formatted_date: session.formattedDate,
        title: session.title,
        duration_minutes: session.durationMinutes,
        format: session.format,
        mentor_name: session.mentorName,
        topics_learned: session.topicsLearned,
        curiosity: session.curiosity,
        mentor_observation: session.mentorObservation,
        activities: session.activities,
        parent_feedback: session.parentFeedback,
        next_session_plan: session.nextSessionPlan,
        scores: session.scores,
        updated_at: new Date().toISOString()
      };

      const { error } = await client.from('sessions').upsert(dbRow);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Failed to persist session to Supabase, saved locally:', err);
    }
  }

  return true;
}

export async function getCuriosityList(): Promise<CuriosityItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('curiosity_questions')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        const loaded = data.map(q => ({
          id: q.id,
          question: q.question,
          date: q.date,
          formattedDate: q.formatted_date,
          topic: q.topic,
          level: q.level,
          status: q.status,
          answeredInSession: q.answered_in_session
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.CURIOSITY, JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (e) {
      console.warn('Fallback to local curiosity questions:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.CURIOSITY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return INITIAL_CURIOSITY_ITEMS; // empty array []
}

export async function saveCuriosityToDb(item: CuriosityItem): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const list = await getCuriosityList();
    const updated = [item, ...list.filter(i => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEYS.CURIOSITY, JSON.stringify(updated));
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('curiosity_questions').upsert({
        id: item.id,
        question: item.question,
        date: item.date,
        formatted_date: item.formattedDate,
        topic: item.topic,
        level: item.level,
        status: item.status,
        answered_in_session: item.answeredInSession
      });
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase curiosity upsert failed:', err);
    }
  }
  return true;
}

export async function getParentFeedbacks(): Promise<ParentFeedbackItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('parent_feedbacks')
        .select('*')
        .order('week_number', { ascending: false });

      if (!error && data) {
        const loaded = data.map(f => ({
          id: f.id,
          weekName: f.week_name,
          weekNumber: f.week_number,
          date: f.date,
          engagementRate: f.engagement_rate,
          checklist: f.checklist || [],
          parentNote: f.parent_note,
          developmentTarget: f.development_target
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.PARENT_FEEDBACK, JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (e) {
      console.warn('Fallback to local parent feedbacks:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.PARENT_FEEDBACK);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return INITIAL_PARENT_FEEDBACK; // empty array []
}

export async function saveParentFeedbackToDb(item: ParentFeedbackItem): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const list = await getParentFeedbacks();
    const updated = [item, ...list.filter(i => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEYS.PARENT_FEEDBACK, JSON.stringify(updated));
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('parent_feedbacks').upsert({
        id: item.id,
        week_name: item.weekName,
        week_number: item.weekNumber,
        date: item.date,
        engagement_rate: item.engagementRate,
        checklist: item.checklist,
        parent_note: item.parentNote,
        development_target: item.developmentTarget
      });
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase parent feedback upsert failed:', err);
    }
  }
  return true;
}

export async function getArtworksList(): Promise<Artwork[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('artworks')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        const loaded = data.map(a => ({
          id: a.id,
          title: a.title,
          category: a.category,
          date: a.date,
          formattedDate: a.formatted_date,
          duration: a.duration,
          thumbnailUrl: a.thumbnail_url || '',
          fileUrl: a.file_url,
          fileSize: a.file_size,
          storageProvider: a.storage_provider || 'cloudflare_r2',
          r2Bucket: a.r2_bucket,
          r2Key: a.r2_key,
          description: a.description
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (e) {
      console.warn('Fallback to local artworks list:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.ARTWORKS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return INITIAL_ARTWORKS; // empty array []
}

export async function saveArtworkToDb(item: Artwork): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const list = await getArtworksList();
    const updated = [item, ...list.filter(i => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(updated));
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('artworks').upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        date: item.date,
        formatted_date: item.formattedDate,
        duration: item.duration,
        thumbnail_url: item.thumbnailUrl,
        file_url: item.fileUrl,
        file_size: item.fileSize,
        storage_provider: item.storageProvider || 'cloudflare_r2',
        r2_bucket: item.r2Bucket,
        r2_key: item.r2Key,
        description: item.description
      });
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase artwork upsert failed:', err);
    }
  }
  return true;
}

export async function getUserProfile(): Promise<UserProfile> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('user_profile')
        .select('*')
        .limit(1)
        .single();

      if (!error && data) {
        const loaded: UserProfile = {
          name: data.name,
          age: data.age,
          interests: data.interests || [],
          avatarUrl: data.avatar_url || '',
          notifications: data.notifications || { newSession: true, parentFeedback: true, monthlyProgress: true }
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (e) {
      console.warn('Fallback to local user profile:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }
  return INITIAL_USER_PROFILE;
}

export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('user_profile').upsert({
        id: 'default',
        name: profile.name,
        age: profile.age,
        interests: profile.interests,
        avatar_url: profile.avatarUrl,
        notifications: profile.notifications,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase user_profile upsert failed:', err);
    }
  }
  return true;
}

// SQL Migration Script ready to run in Supabase SQL Editor
export const SUPABASE_SQL_MIGRATION = `-- ==========================================
-- RAKA LEARNING JOURNEY: SUPABASE SCHEMA MIGRATION
-- Copy & Run in Supabase SQL Editor
-- ==========================================

-- 1. Daily Mentoring Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY,
  session_number INTEGER NOT NULL,
  date DATE NOT NULL,
  formatted_date TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  format TEXT DEFAULT 'Online',
  mentor_name TEXT DEFAULT 'Kak Sabina',
  topics_learned JSONB DEFAULT '[]'::jsonb,
  curiosity JSONB DEFAULT '{}'::jsonb,
  mentor_observation JSONB DEFAULT '{}'::jsonb,
  activities JSONB DEFAULT '{}'::jsonb,
  parent_feedback JSONB DEFAULT '{}'::jsonb,
  next_session_plan JSONB DEFAULT '[]'::jsonb,
  scores JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Curiosity Corner Questions Table
CREATE TABLE IF NOT EXISTS public.curiosity_questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  date DATE NOT NULL,
  formatted_date TEXT NOT NULL,
  topic TEXT NOT NULL,
  level TEXT DEFAULT 'Sedang',
  status TEXT DEFAULT 'Baru',
  answered_in_session INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Parent Observations & Feedback Table
CREATE TABLE IF NOT EXISTS public.parent_feedbacks (
  id TEXT PRIMARY KEY,
  week_name TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  date DATE NOT NULL,
  engagement_rate INTEGER DEFAULT 80,
  checklist JSONB DEFAULT '[]'::jsonb,
  parent_note TEXT,
  development_target TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Artworks & Projects Gallery (with Cloudflare R2 Keys)
CREATE TABLE IF NOT EXISTS public.artworks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  formatted_date TEXT NOT NULL,
  duration TEXT,
  thumbnail_url TEXT,
  file_url TEXT,
  file_size TEXT,
  storage_provider TEXT DEFAULT 'cloudflare_r2',
  r2_bucket TEXT DEFAULT 'raka-learning-assets',
  r2_key TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Monthly Reports Table
CREATE TABLE IF NOT EXISTS public.monthly_reports (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  growth_story TEXT,
  highlights JSONB DEFAULT '{}'::jsonb,
  recap JSONB DEFAULT '{}'::jsonb,
  targets_next_month JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Profile Table
CREATE TABLE IF NOT EXISTS public.user_profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  age INTEGER DEFAULT 9,
  interests JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  notifications JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Access
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curiosity_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for authorized applet users
CREATE POLICY "Public Access Sessions" ON public.sessions FOR ALL USING (true);
CREATE POLICY "Public Access Curiosity" ON public.curiosity_questions FOR ALL USING (true);
CREATE POLICY "Public Access Parent Feedbacks" ON public.parent_feedbacks FOR ALL USING (true);
CREATE POLICY "Public Access Artworks" ON public.artworks FOR ALL USING (true);
CREATE POLICY "Public Access Monthly Reports" ON public.monthly_reports FOR ALL USING (true);
CREATE POLICY "Public Access User Profile" ON public.user_profile FOR ALL USING (true);
`;
