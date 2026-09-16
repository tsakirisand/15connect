'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, School as SchoolIcon, FileText, Sparkles, ArrowRight, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { QRCodeModal } from '@/components/QRCodeModal';

export default function CreateSchoolPage() {
  const router = useRouter();
  const { user, register, createSchool } = useAuth();

  // School fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // President Account fields (if not logged in)
  const [presidentName, setPresidentName] = useState('');
  const [presidentEmail, setPresidentEmail] = useState('');
  const [presidentPassword, setPresidentPassword] = useState('');

  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [createdSchoolName, setCreatedSchoolName] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Παρακαλούμε εισάγετε όνομα σχολείου.');
      return;
    }

    setLoading(true);

    try {
      // 1. If user is not logged in, register them as Admin first
      if (!user) {
        if (!presidentName.trim() || !presidentEmail.trim() || !presidentPassword.trim()) {
          setError('Παρακαλούμε συμπληρώστε τα στοιχεία λογαριασμού Προέδρου (Ονοματεπώνυμο, Email, Κωδικό).');
          setLoading(false);
          return;
        }

        if (presidentPassword.length < 6) {
          setError('Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
          setLoading(false);
          return;
        }

        await register(presidentName, presidentEmail, presidentPassword, 'admin');
      }

      // 2. Create the school space
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9α-ω]/g, '-')
        .replace(/-+/g, '-');

      const created = await createSchool({
        name,
        slug,
        logo_url: logoUrl || undefined,
        description,
        theme_color: '#2563eb',
        contact_email: contactEmail || presidentEmail || undefined,
        contact_phone: contactPhone || undefined,
      });

      setCreatedInviteCode(created.invite_code);
      setCreatedSchoolName(created.name);
      setIsQRModalOpen(true);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/email-already-in-use') {
        setError('Το email χρησιμοποιείται ήδη. Παρακαλούμε συνδεθείτε.');
      } else {
        setError('Αποτυχία δημιουργίας σχολείου: ' + (err?.message || 'Σφάλμα'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 bg-slate-50">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Δημιουργία Χώρου Σχολείου (15μελές)
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Δημιουργία Χώρου Σχολείου
          </h1>
          <p className="text-xs text-slate-500">
            Συμπληρώστε τα στοιχεία του σχολείου. Θα δημιουργηθεί αυτόματα ο 4-ψήφιος κωδικός & QR Code πρόσκλησης για τους μαθητές.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: School Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Στοιχεία Σχολείου
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Όνομα Σχολείου *
              </label>
              <div className="relative">
                <SchoolIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="π.χ. 4ο ΓΥΜΝΑΣΙΟ ΠΑΛΑΙΟΥ ΦΑΛΗΡΟΥ"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Σύντομη Περιγραφή
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Επίσημη πλατφόρμα ενημέρωσης και ιδεών 15μελούς συμβουλίου..."
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: President Credentials (Only shown if user is NOT logged in) */}
          {!user && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>2. Στοιχεία Λογαριασμού Προέδρου</span>
                <span className="text-[11px] font-normal text-slate-400">Δημιουργία λογαριασμού Firebase</span>
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ονοματεπώνυμο Προέδρου *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={presidentName}
                    onChange={(e) => setPresidentName(e.target.value)}
                    placeholder="Αλέξανδρος Παπαδόπουλος"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={presidentEmail}
                      onChange={(e) => setPresidentEmail(e.target.value)}
                      placeholder="president@school.gr"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Κωδικός (min 6 χαρακτήρες) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      value={presidentPassword}
                      onChange={(e) => setPresidentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
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
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition text-sm"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Δημιουργία...' : 'Δημιουργία Χώρου & Παραγωγή QR Code'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {createdInviteCode && (
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => {
            setIsQRModalOpen(false);
            router.push('/dashboard');
          }}
          inviteCode={createdInviteCode}
          schoolName={createdSchoolName}
        />
      )}
    </div>
  );
}
