'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, ShieldAlert, ArrowRight, User } from 'lucide-react';

export default function JoinSchoolPage() {
  const router = useRouter();
  const { user, currentSchool, joinSchoolByCode, loading } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Require Account First
  useEffect(() => {
    if (!loading && !user) {
      router.push('/register?role=student');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setError('');

    const success = await joinSchoolByCode(code);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Μη έγκυρος κωδικός πρόσκλησης. Παρακαλούμε ζητήστε τον 4-ψήφιο κωδικό από το 15μελές συμβούλιο του σχολείου σας.');
    }
    setSubmitting(false);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Είσοδος σε Σχολείο
          </h1>
          <p className="text-xs text-slate-500">
            Συνδεδεμένος ως: <strong className="text-slate-800">{user.fullName}</strong> ({user.email})
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-amber-800">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <p className="text-xs leading-relaxed">
            Πρέπει να πληκτρολογήσετε τον <strong>4-ψήφιο κωδικό πρόσκλησης</strong> για να συνδεθείτε στο συγκεκριμένο σχολείο.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 text-center">
              4-Ψήφιος Κωδικός Πρόσκλησης
            </label>
            <input
              type="text"
              maxLength={4}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ΚΩΔΙΚΟΣ"
              className="w-full py-4 text-center text-3xl font-black tracking-widest uppercase bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono text-slate-900 transition"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl text-center border border-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || code.length < 4}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 transition text-sm"
          >
            {submitting ? 'Επαλήθευση...' : 'Είσοδος στο Σχολείο'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
