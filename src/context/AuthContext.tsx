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
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at' | 'school_id'>) => void;
  deleteAnnouncement: (id: string) => void;
  addEvent: (event: Omit<SchoolEvent, 'id' | 'created_at' | 'school_id'>) => void;
  deleteEvent: (id: string) => void;
  submitIdea: (idea: Omit<StudentIdea, 'id' | 'created_at' | 'status' | 'school_id' | 'student_uid' | 'student_name'>) => void;
  updateIdeaStatus: (id: string, status: StudentIdea['status'], admin_response?: string) => void;
  updateSchool: (updatedData: Partial<School>) => void;
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

  // Initialize Firebase Auth listener & local state
  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem('15connect_school');
      const savedAnnouncements = localStorage.getItem('15connect_announcements');
      const savedEvents = localStorage.getItem('15connect_events');
      const savedIdeas = localStorage.getItem('15connect_ideas');
      const savedMembers = localStorage.getItem('15connect_members');

      if (savedSchool) setCurrentSchool(JSON.parse(savedSchool));
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
      if (savedMembers) setMembers(JSON.parse(savedMembers));
    } catch (e) {
      console.error('Error loading stored school state:', e);
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
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
    if (sch) localStorage.setItem('15connect_school', JSON.stringify(sch));
    else localStorage.removeItem('15connect_school');
  };

  const saveAnnouncements = (list: Announcement[]) => {
    setAnnouncements(list);
    localStorage.setItem('15connect_announcements', JSON.stringify(list));
  };

  const saveEvents = (list: SchoolEvent[]) => {
    setEvents(list);
    localStorage.setItem('15connect_events', JSON.stringify(list));
  };

  const saveIdeas = (list: StudentIdea[]) => {
    setIdeas(list);
    localStorage.setItem('15connect_ideas', JSON.stringify(list));
  };

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('15connect_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('15connect_user');
    }
  };

  const saveMembers = (list: SchoolMember[]) => {
    setMembers(list);
    localStorage.setItem('15connect_members', JSON.stringify(list));
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

      if (schoolCode && currentSchool && schoolCode.toUpperCase() !== currentSchool.invite_code) {
        return false;
      }

      saveUser(newUser);
      return true;
    } catch (err) {
      console.error('Firebase Auth Login Error:', err);
      throw err;
    }
  };

  // Real Firebase SignOut
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Firebase SignOut Error:', e);
    }
    saveUser(null);
  };

  // Create School
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

    saveSchool(newSchool);

    if (user) {
      const updatedUser = { ...user, role: 'admin' as UserRole, schoolId: newSchool.id };
      saveUser(updatedUser);

      const newMember: SchoolMember = {
        id: `mem-${Date.now()}`,
        school_id: newSchool.id,
        user_uid: user.uid,
        email: user.email,
        full_name: user.fullName,
        role: 'admin',
        joined_at: new Date().toISOString(),
      };
      saveMembers([newMember, ...members]);
    }

    return newSchool;
  };

  // Join School with Invite Code
  const joinSchoolByCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!currentSchool) return false;

    if (cleanCode === currentSchool.invite_code) {
      if (user) {
        const updatedUser = { ...user, schoolId: currentSchool.id, role: 'student' as UserRole };
        saveUser(updatedUser);

        const exists = members.some((m) => m.user_uid === user.uid);
        if (!exists) {
          const newMember: SchoolMember = {
            id: `mem-${Date.now()}`,
            school_id: currentSchool.id,
            user_uid: user.uid,
            email: user.email,
            full_name: user.fullName,
            role: 'student',
            joined_at: new Date().toISOString(),
          };
          saveMembers([newMember, ...members]);
        }
      }
      return true;
    }
    return false;
  };

  // Announcements CRUD
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'created_at' | 'school_id'>) => {
    if (!currentSchool) return;
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      school_id: currentSchool.id,
      created_at: new Date().toISOString(),
    };
    saveAnnouncements([newAnn, ...announcements]);
  };

  const deleteAnnouncement = (id: string) => {
    saveAnnouncements(announcements.filter((a) => a.id !== id));
  };

  // Events CRUD
  const addEvent = (data: Omit<SchoolEvent, 'id' | 'created_at' | 'school_id'>) => {
    if (!currentSchool) return;
    const newEvt: SchoolEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      school_id: currentSchool.id,
      created_at: new Date().toISOString(),
    };
    saveEvents([newEvt, ...events]);
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
  };

  // Student Ideas
  const submitIdea = (
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
    saveIdeas([newIdea, ...ideas]);
  };

  const updateIdeaStatus = (id: string, status: StudentIdea['status'], admin_response?: string) => {
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
    saveIdeas(updated);
  };

  const updateSchool = (updatedData: Partial<School>) => {
    if (!currentSchool) return;
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
