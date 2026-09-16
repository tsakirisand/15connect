-- ================================================================
-- 15Connect - Greek Student Council Platform (15μελή Συμβούλια)
-- Supabase Database Schema & Row Level Security (RLS) Policies
-- ================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  description TEXT,
  theme_color TEXT DEFAULT '#2563eb',
  contact_email TEXT,
  contact_phone TEXT,
  invite_code VARCHAR(4) UNIQUE NOT NULL,
  created_by_uid TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SCHOOL MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.school_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_uid TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(school_id, user_uid)
);

-- 3. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Γενικά',
  image_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  cover_image_url TEXT,
  external_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. STUDENT IDEAS TABLE
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_uid TEXT NOT NULL,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Γενικά',
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'accepted', 'rejected')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_schools_invite_code ON public.schools(invite_code);
CREATE INDEX IF NOT EXISTS idx_members_user_uid ON public.school_members(user_uid);
CREATE INDEX IF NOT EXISTS idx_members_school_id ON public.school_members(school_id);
CREATE INDEX IF NOT EXISTS idx_announcements_school_id ON public.announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_events_school_id ON public.events(school_id);
CREATE INDEX IF NOT EXISTS idx_ideas_school_id ON public.ideas(school_id);
CREATE INDEX IF NOT EXISTS idx_ideas_student_uid ON public.ideas(student_uid);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- 1. SCHOOLS POLICIES
DROP POLICY IF EXISTS "Allow public select of schools" ON public.schools;
CREATE POLICY "Allow public select of schools" ON public.schools FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of schools" ON public.schools;
CREATE POLICY "Allow public insert of schools" ON public.schools FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of schools" ON public.schools;
CREATE POLICY "Allow public update of schools" ON public.schools FOR UPDATE USING (true);

-- 2. SCHOOL MEMBERS POLICIES
DROP POLICY IF EXISTS "Allow public select of school_members" ON public.school_members;
CREATE POLICY "Allow public select of school_members" ON public.school_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of school_members" ON public.school_members;
CREATE POLICY "Allow public insert of school_members" ON public.school_members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of school_members" ON public.school_members;
CREATE POLICY "Allow public update of school_members" ON public.school_members FOR UPDATE USING (true);

-- 3. ANNOUNCEMENTS POLICIES
DROP POLICY IF EXISTS "Allow public select of announcements" ON public.announcements;
CREATE POLICY "Allow public select of announcements" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of announcements" ON public.announcements;
CREATE POLICY "Allow public insert of announcements" ON public.announcements FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete of announcements" ON public.announcements;
CREATE POLICY "Allow public delete of announcements" ON public.announcements FOR DELETE USING (true);

-- 4. EVENTS POLICIES
DROP POLICY IF EXISTS "Allow public select of events" ON public.events;
CREATE POLICY "Allow public select of events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of events" ON public.events;
CREATE POLICY "Allow public insert of events" ON public.events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete of events" ON public.events;
CREATE POLICY "Allow public delete of events" ON public.events FOR DELETE USING (true);

-- 5. IDEAS POLICIES
DROP POLICY IF EXISTS "Allow public select of ideas" ON public.ideas;
CREATE POLICY "Allow public select of ideas" ON public.ideas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of ideas" ON public.ideas;
CREATE POLICY "Allow public insert of ideas" ON public.ideas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of ideas" ON public.ideas;
CREATE POLICY "Allow public update of ideas" ON public.ideas FOR UPDATE USING (true);
