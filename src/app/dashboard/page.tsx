'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Megaphone,
  Calendar,
  Lightbulb,
  ShieldCheck,
  Lock,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { QRCodeModal } from '@/components/QRCodeModal';

export default function DashboardPage() {
  const router = useRouter();
  const { currentSchool, announcements, events, user, loading } = useAuth();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?message=auth_required');
      } else if (!user.schoolId || !currentSchool) {
        router.push('/join');
      }
    }
  }, [user, currentSchool, loading, router]);

  if (loading || !user || !currentSchool) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Έλεγχος πρόσβασης...</h2>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const recentAnnouncements = announcements.slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* School Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentSchool.logo_url || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80'}
            alt="Logo"
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                15μελές Συμβούλιο
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Κωδικός: {currentSchool.invite_code}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{currentSchool.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{currentSchool.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Link
            href="/ideas"
            className="flex-1 md:flex-initial px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            <Lightbulb className="w-4 h-4" /> Υποβολή Πρότασης
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Διαχείριση
            </Link>
          )}
        </div>
      </div>

      {/* Main Feed & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              Ανακοινώσεις Σχολείου
            </h2>
            <Link href="/announcements" className="text-xs font-semibold text-blue-600 hover:underline">
              Όλες →
            </Link>
          </div>

          <div className="space-y-3">
            {recentAnnouncements.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded">
                    {item.category}
                  </span>
                  <span className="text-slate-400">
                    {new Date(item.created_at).toLocaleDateString('el-GR')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Εκδηλώσεις
            </h2>
            <Link href="/events" className="text-xs font-semibold text-indigo-600 hover:underline">
              Προβολή →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div key={evt.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {evt.event_date} @ {evt.event_time}
                </span>
                <h4 className="font-bold text-xs text-slate-900">{evt.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
