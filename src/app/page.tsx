'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  KeyRound,
  Megaphone,
  Calendar,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { currentSchool, joinSchoolByCode } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setError('');

    const success = await joinSchoolByCode(code);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Ο κωδικός δεν βρέθηκε. Ελέγξτε τον 4-ψήφιο κωδικό πρόσκλησης.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          Το ψηφιακό 15μελές του σχολείου σου
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Ενημερώσου για το σχολείο σου & μοιράσου τις ιδέες σου
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Ανακοινώσεις, εκδηλώσεις και υποβολή προτάσεων απευθείας στο 15μελές συμβούλιο του σχολείου σου.
        </p>
      </div>

      {/* Student 4-Char Code Entry Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto space-y-4 text-center">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Έχεις κωδικό πρόσκλησης;</h2>
          <p className="text-xs text-slate-500 mt-0.5">Πληκτρολόγησε τον 4-ψήφιο κωδικό από το 15μελές σου</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-3">
          <input
            type="text"
            maxLength={4}
            placeholder="ΚΩΔΙΚΟΣ"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full py-3 text-center text-2xl font-black tracking-widest uppercase bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
          />

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
          >
            Είσοδος στο Σχολείο <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Simple Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/announcements"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition text-left space-y-2 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
            <Megaphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Ανακοινώσεις</h3>
          <p className="text-xs text-slate-500">Επίσημα νέα, εκδρομές και θέματα σχολείου.</p>
        </Link>

        <Link
          href="/events"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition text-left space-y-2 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Εκδηλώσεις</h3>
          <p className="text-xs text-slate-500">Πρόγραμμα εορτών, αθλητισμού & bazaar.</p>
        </Link>

        <Link
          href="/ideas"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition text-left space-y-2 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Προτάσεις Μαθητών</h3>
          <p className="text-xs text-slate-500">Στείλε ιδέες στο 15μελές συμβούλιο.</p>
        </Link>
      </div>

      {/* Discrete President Access Banner at Bottom */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Είσαι Πρόεδρος 15μελούς;</h4>
            <p className="text-xs text-slate-400">Δημιούργησε το ψηφιακό χώρο του σχολείου σου.</p>
          </div>
        </div>

        <Link
          href="/onboarding/create-school"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shrink-0"
        >
          Δημιουργία Χώρου Σχολείου →
        </Link>
      </div>
    </div>
  );
}
