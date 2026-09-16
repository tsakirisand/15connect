'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, School as SchoolIcon, Image, Palette, Mail, Phone, FileText, Sparkles, ArrowRight, QrCode } from 'lucide-react';
import { QRCodeModal } from '@/components/QRCodeModal';

export default function CreateSchoolPage() {
  const router = useRouter();
  const { user, createSchool } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [createdSchoolName, setCreatedSchoolName] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Require President Account First
  useEffect(() => {
    if (!user) {
      router.push('/register?role=admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9α-ω]/g, '-')
        .replace(/-+/g, '-');

      const created = await createSchool({
        name,
        slug,
        logo_url: logoUrl || undefined,
        cover_url: coverUrl || undefined,
        description,
        theme_color: themeColor,
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
      });

      setCreatedInviteCode(created.invite_code);
      setCreatedSchoolName(created.name);
      setIsQRModalOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Δημιουργία Χώρου Σχολείου (Πρόεδρος)
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Στοιχεία Σχολείου & 15μελούς
          </h1>
          <p className="text-xs text-slate-500">
            Συμπληρώστε το όνομα και τα στοιχεία του σχολείου. Θα παραχθεί αυτόματα ο 4-ψήφιος κωδικός & QR Code πρόσκλησης για τους μαθητές.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Επίσημη πλατφόρμα ενημέρωσης και ιδεών 15μελούς συμβουλίου..."
                className="w-full pl-9 pr-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Logo / Εικόνα (URL)
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Επικοινωνίας
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="15meles@school.gr"
                className="w-full px-3 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

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
