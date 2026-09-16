'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, ShieldCheck, UserCheck, User, Mail, Lock, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, joinSchoolByCode, currentSchool } = useAuth();

  const initialRole = (searchParams.get('role') as UserRole) || 'student';
  const initialCode = searchParams.get('code') || '';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState(initialCode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRole) setRole(initialRole);
    if (initialCode) setInviteCode(initialCode.toUpperCase());
  }, [initialRole, initialCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Παρακαλούμε συμπληρώστε όλα τα πεδία.');
      return;
    }

    if (role === 'student') {
      if (!inviteCode.trim() || inviteCode.length < 4) {
        setError('Απαιτείται έγκυρος 4-ψήφιος κωδικός πρόσκλησης σχολείου.');
        return;
      }

      // Check invite code
      if (currentSchool && inviteCode.toUpperCase() !== currentSchool.invite_code) {
        setError('Ο κωδικός πρόσκλησης δεν αντιστοιχεί σε κάποιο σχολείο. Ζητήστε τον κωδικό από το 15μελές σας.');
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Create account
      const success = await register(fullName, email, role);
      if (!success) {
        setError('Αποτυχία δημιουργίας λογαριασμού. Δοκιμάστε ξανά.');
        setLoading(false);
        return;
      }

      // 2. Redirect according to role
      if (role === 'admin') {
        router.push('/onboarding/create-school');
      } else {
        await joinSchoolByCode(inviteCode);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Προέκυψε σφάλμα κατά την εγγραφή.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Δημιουργία Λογαριασμού
          </h1>
          <p className="text-xs text-slate-500">
            Πρέπει να δημιουργήσετε λογαριασμό για πρόσβαση στο 15Connect
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Μαθητής
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Πρόεδρος 15μελούς
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Ονοματεπώνυμο *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="π.χ. Αλέξανδρος Παπαδόπουλος"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.gr"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Κωδικός Πρόσβασης *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Student Requires School Invite Code */}
          {role === 'student' && (
            <div className="pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                4-Ψήφιος Κωδικός Πρόσκλησης Σχολείου *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="ΚΩΔΙΚΟΣ (π.χ. VMD2)"
                  className="w-full pl-9 pr-4 py-3 font-mono font-bold tracking-widest bg-slate-50 text-blue-600 rounded-xl border border-slate-200 text-base uppercase focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Πληκτρολογήστε τον κωδικό που σας έδωσε το 15μελές συμβούλιο.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition text-sm"
          >
            {loading ? 'Εγγραφή...' : role === 'admin' ? 'Εγγραφή & Συνέχεια στη Δημιουργία Σχολείου' : 'Εγγραφή & Είσοδος στο Σχολείο'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Έχετε ήδη λογαριασμό;{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            Σύνδεση εδώ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Φόρτωση...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
