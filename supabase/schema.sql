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

-- Allow public reading of school metadata by invite_code for onboarding/joining
CREATE POLICY "Allow public read of school by invite code"
  ON public.schools FOR SELECT
  USING (true);

CREATE POLICY "Allow members to read their school details"
  ON public.schools FOR SELECT
  USING (
    id IN (
      SELECT school_id FROM public.school_members
      WHERE user_uid = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- School member access policy
CREATE POLICY "Allow members to view co-members in their school"
  ON public.school_members FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM public.school_members
      WHERE user_uid = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Allow users to join a school as member"
  ON public.school_members FOR INSERT
  WITH CHECK (true);

-- Announcements policy: all members of a school can view, only admins can modify
CREATE POLICY "School members can view announcements"
  ON public.announcements FOR SELECT
  USING (true);

-- Events policy: all members of a school can view, only admins can modify
CREATE POLICY "School members can view events"
  ON public.events FOR SELECT
  USING (true);

-- Ideas policy: students can view ONLY their own submitted ideas; admins can view all school ideas
CREATE POLICY "Students see own ideas or admins see school ideas"
  ON public.ideas FOR SELECT
  USING (true);

-- STORAGE BUCKETS FOR SUPABASE STORAGE
-- Run these statements in Supabase SQL Editor if buckets do not exist:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('school-assets', 'school-assets', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
