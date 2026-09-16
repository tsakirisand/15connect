'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, School, SchoolMember, Announcement, SchoolEvent, StudentIdea, UserRole } from '@/types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  currentSchool: School | null;
  members: SchoolMember[];
  announcements: Announcement[];
  events: SchoolEvent[];
  ideas: StudentIdea[];
  loading: boolean;
  login: (email: string, pass: string, role: UserRole, schoolCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (fullName: string, email: string, pass: string, role: UserRole) => Promise<boolean>;
  createSchool: (schoolData: Omit<School, 'id' | 'invite_code' | 'created_by_uid' | 'created_at'>) => Promise<School>;
  joinSchoolByCode: (code: string) => Promise<boolean>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at' | 'school_id'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addEvent: (event: Omit<SchoolEvent, 'id' | 'created_at' | 'school_id'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  submitIdea: (idea: Omit<StudentIdea, 'id' | 'created_at' | 'status' | 'school_id' | 'student_uid' | 'student_name'>) => Promise<void>;
  updateIdeaStatus: (id: string, status: StudentIdea['status'], admin_response?: string) => Promise<void>;
  updateSchool: (updatedData: Partial<School>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [members, setMembers] = useState<SchoolMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [ideas, setIdeas] = useState<StudentIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load school data helper
  const loadSchoolData = async (schoolId: string) => {
    try {
      // 1. Fetch announcements
      const { data: annData } = await supabase
        .from('announcements')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (annData) setAnnouncements(annData);

      // 2. Fetch events
      const { data: evtData } = await supabase
        .from('events')
        .select('*')
        .eq('school_id', schoolId)
        .order('event_date', { ascending: true });

      if (evtData) setEvents(evtData);

      // 3. Fetch ideas
      const { data: ideaData } = await supabase
        .from('ideas')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (ideaData) setIdeas(ideaData);

      // 4. Fetch members
      const { data: memData } = await supabase
        .from('school_members')
        .select('*')
        .eq('school_id', schoolId);

      if (memData) setMembers(memData);
    } catch (e) {
      console.error('Error fetching Supabase school data:', e);
    }
  };

  // Initialize Firebase Auth listener & local state
  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem('15connect_school');
      if (savedSchool) {
        const sch = JSON.parse(savedSchool);
        setCurrentSchool(sch);
        loadSchoolData(sch.id);
      }
    } catch (e) {
      console.error('Error loading stored school state:', e);
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const savedUserStr = localStorage.getItem('15connect_user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          fullName: fbUser.displayName || savedUser?.fullName || 'Χρήστης 15Connect',
          role: savedUser?.role || 'student',
          schoolId: savedUser?.schoolId,
        };

        setUser(profile);
        localStorage.setItem('15connect_user', JSON.stringify(profile));

        if (profile.schoolId) {
          loadSchoolData(profile.schoolId);
        }
      } else {
        setUser(null);
        localStorage.removeItem('15connect_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveSchool = (sch: School | null) => {
    setCurrentSchool(sch);
    if (sch) {
      localStorage.setItem('15connect_school', JSON.stringify(sch));
      loadSchoolData(sch.id);
    } else {
      localStorage.removeItem('15connect_school');
    }
  };

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('15connect_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('15connect_user');
    }
  };

  // Real Firebase Registration
  const register = async (fullName: string, email: string, pass: string, role: UserRole): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;

      if (fullName) {
        await updateProfile(fbUser, { displayName: fullName });
      }

      const newUser: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        fullName: fullName || 'Χρήστης 15Connect',
        role,
        schoolId: role === 'admin' ? currentSchool?.id : undefined,
      };

      saveUser(newUser);
      return true;
    } catch (err) {
      console.error('Firebase Auth Register Error:', err);
      throw err;
    }
  };

  // Real Firebase Login
  const login = async (email: string, pass: string, role: UserRole, schoolCode?: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;

      const newUser: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        fullName: fbUser.displayName || (role === 'admin' ? 'Πρόεδρος 15μελούς' : 'Μαθητής'),
        role,
        schoolId: currentSchool?.id,
      };

      saveUser(newUser);

      if (schoolCode) {
        await joinSchoolByCode(schoolCode);
      }

      return true;
    } catch (err) {
      console.error('Firebase Auth Login Error:', err);
      throw err;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Firebase SignOut Error:', e);
    }
    saveUser(null);
  };

  // Create School (Supabase + Local)
  const createSchool = async (
    schoolData: Omit<School, 'id' | 'invite_code' | 'created_by_uid' | 'created_at'>
  ): Promise<School> => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newSchool: School = {
      ...schoolData,
      id: `sch-${Date.now()}`,
      invite_code: code,
      created_by_uid: user?.uid || 'uid-admin',
      created_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase `schools` table
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert([
          {
            name: newSchool.name,
            slug: newSchool.slug,
            logo_url: newSchool.logo_url,
            cover_url: newSchool.cover_url,
            description: newSchool.description,
            theme_color: newSchool.theme_color,
            contact_email: newSchool.contact_email,
            contact_phone: newSchool.contact_phone,
            invite_code: newSchool.invite_code,
            created_by_uid: newSchool.created_by_uid,
          },
        ])
        .select()
        .single();

      if (data) {
        newSchool.id = data.id;
      }
      if (error) {
        console.warn('Supabase school insert notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase DB offline/notice, using local fallback:', e);
    }

    saveSchool(newSchool);

    if (user) {
      const updatedUser = { ...user, role: 'admin' as UserRole, schoolId: newSchool.id };
      saveUser(updatedUser);

      // Insert member into Supabase
      try {
        await supabase.from('school_members').insert([
          {
            school_id: newSchool.id,
            user_uid: user.uid,
            email: user.email,
            full_name: user.fullName,
            role: 'admin',
          },
        ]);
      } catch (e) {
        console.warn('Supabase member insert notice:', e);
      }
    }

    return newSchool;
  };

  // Join School by Invite Code (Supabase Query + Local Fallback)
  const joinSchoolByCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();

    // 1. Check current local school
    if (currentSchool && currentSchool.invite_code === cleanCode) {
      if (user) {
        const updatedUser = { ...user, schoolId: currentSchool.id, role: 'student' as UserRole };
        saveUser(updatedUser);
      }
      return true;
    }

    // 2. Query Supabase DB for school with invite_code = cleanCode
    try {
      const { data: schoolsList, error } = await supabase
        .from('schools')
        .select('*')
        .eq('invite_code', cleanCode);

      if (error) {
        console.error('Supabase search error:', error.message);
      }

      if (schoolsList && schoolsList.length > 0) {
        const dbSchool = schoolsList[0];
        const foundSchool: School = {
          id: dbSchool.id,
          name: dbSchool.name,
          slug: dbSchool.slug,
          logo_url: dbSchool.logo_url,
          cover_url: dbSchool.cover_url,
          description: dbSchool.description,
          theme_color: dbSchool.theme_color,
          contact_email: dbSchool.contact_email,
          contact_phone: dbSchool.contact_phone,
          invite_code: dbSchool.invite_code,
          created_by_uid: dbSchool.created_by_uid,
          created_at: dbSchool.created_at,
        };

        saveSchool(foundSchool);

        if (user) {
          const updatedUser = { ...user, schoolId: foundSchool.id, role: 'student' as UserRole };
          saveUser(updatedUser);

          // Insert member into Supabase
          await supabase.from('school_members').upsert([
            {
              school_id: foundSchool.id,
              user_uid: user.uid,
              email: user.email,
              full_name: user.fullName,
              role: 'student',
            },
          ]);
        }
        return true;
      }
    } catch (e) {
      console.warn('Supabase DB search notice:', e);
    }

    return false;
  };

  // Announcements CRUD
  const addAnnouncement = async (data: Omit<Announcement, 'id' | 'created_at' | 'school_id'>) => {
    if (!currentSchool) return;
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      school_id: currentSchool.id,
      created_at: new Date().toISOString(),
    };

    try {
      const { data: inserted } = await supabase
        .from('announcements')
        .insert([
          {
            school_id: currentSchool.id,
            title: newAnn.title,
            content: newAnn.content,
            category: newAnn.category,
            image_url: newAnn.image_url,
            is_pinned: newAnn.is_pinned,
            author_name: newAnn.author_name,
          },
        ])
        .select()
        .single();

      if (inserted) newAnn.id = inserted.id;
    } catch (e) {
      console.warn('Supabase announcement insert notice:', e);
    }

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('15connect_announcements', JSON.stringify(updated));
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await supabase.from('announcements').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete notice:', e);
    }
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('15connect_announcements', JSON.stringify(updated));
  };

  // Events CRUD
  const addEvent = async (data: Omit<SchoolEvent, 'id' | 'created_at' | 'school_id'>) => {
    if (!currentSchool) return;
    const newEvt: SchoolEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      school_id: currentSchool.id,
      created_at: new Date().toISOString(),
    };

    try {
      const { data: inserted } = await supabase
        .from('events')
        .insert([
          {
            school_id: currentSchool.id,
            title: newEvt.title,
            description: newEvt.description,
            event_date: newEvt.event_date,
            event_time: newEvt.event_time,
            location: newEvt.location,
            cover_image_url: newEvt.cover_image_url,
            external_link: newEvt.external_link,
          },
        ])
        .select()
        .single();

      if (inserted) newEvt.id = inserted.id;
    } catch (e) {
      console.warn('Supabase event insert notice:', e);
    }

    const updated = [newEvt, ...events];
    setEvents(updated);
    localStorage.setItem('15connect_events', JSON.stringify(updated));
  };

  const deleteEvent = async (id: string) => {
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete notice:', e);
    }
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem('15connect_events', JSON.stringify(updated));
  };

  // Student Ideas
  const submitIdea = async (
    data: Omit<StudentIdea, 'id' | 'created_at' | 'status' | 'school_id' | 'student_uid' | 'student_name'>
  ) => {
    if (!currentSchool || !user) return;
    const newIdea: StudentIdea = {
      ...data,
      id: `idea-${Date.now()}`,
      school_id: currentSchool.id,
      student_uid: user.uid,
      student_name: user.fullName,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    try {
      const { data: inserted } = await supabase
        .from('ideas')
        .insert([
          {
            school_id: currentSchool.id,
            student_uid: user.uid,
            student_name: user.fullName,
            title: newIdea.title,
            description: newIdea.description,
            category: newIdea.category,
            status: 'new',
          },
        ])
        .select()
        .single();

      if (inserted) newIdea.id = inserted.id;
    } catch (e) {
      console.warn('Supabase idea insert notice:', e);
    }

    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    localStorage.setItem('15connect_ideas', JSON.stringify(updated));
  };

  const updateIdeaStatus = async (id: string, status: StudentIdea['status'], admin_response?: string) => {
    try {
      await supabase
        .from('ideas')
        .update({ status, admin_response, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase idea update notice:', e);
    }

    const updated = ideas.map((idea) => {
      if (idea.id === id) {
        return {
          ...idea,
          status,
          admin_response: admin_response !== undefined ? admin_response : idea.admin_response,
          updated_at: new Date().toISOString(),
        };
      }
      return idea;
    });
    setIdeas(updated);
    localStorage.setItem('15connect_ideas', JSON.stringify(updated));
  };

  const updateSchool = async (updatedData: Partial<School>) => {
    if (!currentSchool) return;

    try {
      await supabase.from('schools').update(updatedData).eq('id', currentSchool.id);
    } catch (e) {
      console.warn('Supabase school update notice:', e);
    }

    const updated = { ...currentSchool, ...updatedData };
    saveSchool(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentSchool,
        members,
        announcements,
        events,
        ideas,
        loading,
        login,
        logout,
        register,
        createSchool,
        joinSchoolByCode,
        addAnnouncement,
        deleteAnnouncement,
        addEvent,
        deleteEvent,
        submitIdea,
        updateIdeaStatus,
        updateSchool,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
