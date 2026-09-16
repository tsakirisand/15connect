import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Main Footer Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-900">
              15<span className="text-blue-600">Connect</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Αρχική
            </Link>
            <Link href="/announcements" className="hover:text-blue-600 transition">
              Ανακοινώσεις
            </Link>
            <Link href="/events" className="hover:text-blue-600 transition">
              Εκδηλώσεις
            </Link>
            <Link href="/ideas" className="hover:text-blue-600 transition">
              Προτάσεις
            </Link>
            <Link href="/join" className="hover:text-blue-600 transition">
              Είσοδος Μαθητή
            </Link>
          </div>
        </div>

        {/* Discrete President Access Option at Bottom */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Είσαι Πρόεδρος ή μέλος 15μελούς;</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/create-school"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Δημιουργία Χώρου Σχολείου
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/login?role=admin"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
            >
              Είσοδος Προέδρου (Admin) →
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} 15Connect. Η ψηφιακή πλατφόρμα των ελληνικών μαθητικών συμβουλίων.
        </div>
      </div>
    </footer>
  );
};
