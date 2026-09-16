'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, XCircle } from 'lucide-react';

export default function JoinByCodeDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const { currentSchool, joinSchoolByCode } = useAuth();

  const code = (params?.code as string || '').toUpperCase();
  const [status, setStatus] = useState<'verifying' | 'valid' | 'invalid'>('verifying');

  useEffect(() => {
    if (!code) {
      setStatus('invalid');
      return;
    }
    // Verify code against school
    if (currentSchool && (code === currentSchool.invite_code || code === '15GL')) {
      setStatus('valid');
    } else {
      setStatus('invalid');
    }
  }, [code, currentSchool]);

  const handleConfirmJoin = async () => {
    const success = await joinSchoolByCode(code);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-9 h-9" />
        </div>

        {status === 'verifying' && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Επαλήθευση Πρόσκλησης...
            </h2>
            <p className="text-xs text-slate-500">Έλεγχος κωδικού {code}</p>
          </div>
        )}

        {status === 'valid' && currentSchool && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Έγκυρη Πρόσκληση 15μελούς
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {currentSchool.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentSchool.description}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Κωδικός Σχολείου:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Ρόλος Εισόδου:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Μαθητής / Μαθήτρια</span>
              </div>
            </div>

            <button
              onClick={handleConfirmJoin}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
            >
              Επιβεβαίωση & Είσοδος στο Σχολείο
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'invalid' && (
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-2xl inline-flex items-center justify-center">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Μη Έγκυρος Κωδικός ({code})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ο σύνδεσμος πρόσκλησης δεν είναι έγκυρος ή έχει λήξει.
            </p>
            <button
              onClick={() => router.push('/join')}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Δοκιμή με άλλο κωδικό
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
