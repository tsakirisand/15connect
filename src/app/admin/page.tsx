'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  QrCode,
  Megaphone,
  Calendar,
  Lightbulb,
  Users,
  Settings,
  Plus,
  Trash2,
  Download,
  MessageSquare,
} from 'lucide-react';
import { QRCodeModal } from '@/components/QRCodeModal';
import { IdeaStatusBadge } from '@/components/IdeaStatusBadge';
import { AnnouncementCategory, IdeaStatus } from '@/types';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'invites';

  const {
    currentSchool,
    announcements,
    events,
    ideas,
    members,
    addAnnouncement,
    deleteAnnouncement,
    addEvent,
    deleteEvent,
    updateIdeaStatus,
    updateSchool,
    user,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('Γενικά');
  const [annImage, setAnnImage] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  // New Event Form State
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtDate, setEvtDate] = useState(new Date().toISOString().split('T')[0]);
  const [evtTime, setEvtTime] = useState('11:00');
  const [evtLocation, setEvtLocation] = useState('Αίθουσα Εκδηλώσεων Σχολείου');
  const [evtCover, setEvtCover] = useState('');
  const [evtLink, setEvtLink] = useState('');

  // Idea response state
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [ideaResponseText, setIdeaResponseText] = useState('');
  const [ideaStatusSelected, setIdeaStatusSelected] = useState<IdeaStatus>('accepted');

  // School Settings Form State
  const [schoolName, setSchoolName] = useState(currentSchool?.name || '');
  const [schoolDesc, setSchoolDesc] = useState(currentSchool?.description || '');
  const [schoolLogo, setSchoolLogo] = useState(currentSchool?.logo_url || '');

  useEffect(() => {
    if (currentSchool) {
      setSchoolName(currentSchool.name);
      setSchoolDesc(currentSchool.description);
      setSchoolLogo(currentSchool.logo_url || '');
    }
  }, [currentSchool]);

  if (!currentSchool) {
    return <div className="p-8 text-center text-xs text-slate-500">Δεν βρέθηκε σχολείο.</div>;
  }

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    addAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      image_url: annImage || undefined,
      is_pinned: annPinned,
      author_name: user?.fullName || '15μελές Συμβούλιο',
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnImage('');
    setAnnPinned(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtDesc || !evtDate) return;

    addEvent({
      title: evtTitle,
      description: evtDesc,
      event_date: evtDate,
      event_time: evtTime,
      location: evtLocation,
      cover_image_url: evtCover || undefined,
      external_link: evtLink || undefined,
    });

    setEvtTitle('');
    setEvtDesc('');
    setEvtCover('');
    setEvtLink('');
  };

  const handleSaveIdeaResponse = (ideaId: string) => {
    updateIdeaStatus(ideaId, ideaStatusSelected, ideaResponseText);
    setEditingIdeaId(null);
    setIdeaResponseText('');
  };

  const handleUpdateSchoolSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      name: schoolName,
      description: schoolDesc,
      logo_url: schoolLogo,
    });
    alert('Τα στοιχεία του σχολείου ενημερώθηκαν!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Πίνακας Ελέγχου Προέδρου (Admin Control Panel)
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Διαχείριση 15μελούς — {currentSchool.name}
          </h1>
          <p className="text-xs text-slate-500">
            Διαχειριστείτε τις προσκλήσεις μαθητών, ανακοινώσεις, εκδηλώσεις και προτάσεις.
          </p>
        </div>

        <button
          onClick={() => setIsQRModalOpen(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xs text-xs flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" /> Προβολή & Λήψη QR Code
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('invites')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'invites'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" /> Πρόσκληση & QR
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'announcements'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Ανακοινώσεις ({announcements.length})
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'events'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" /> Εκδηλώσεις ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'ideas'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" /> Προτάσεις Μαθητών ({ideas.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" /> Μέλη & Ρυθμίσεις
        </button>
      </div>

      {/* TAB 1: INVITES & QR CODE */}
      {activeTab === 'invites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Κωδικός Πρόσκλησης & QR Code
              </h3>
              <p className="text-xs text-slate-500">
                Μοιραστείτε τον κωδικό ή τυπώστε το QR Code για να εγγραφούν οι μαθητές του σχολείου.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                4-Ψήφιος Κωδικός Πρόσκλησης
              </span>
              <div className="text-4xl font-black font-mono tracking-widest text-blue-600">
                {currentSchool.invite_code}
              </div>
            </div>

            <button
              onClick={() => setIsQRModalOpen(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition"
            >
              <Download className="w-4 h-4" /> Άνοιγμα & Λήψη QR Code
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Οδηγίες για το 15μελές
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Κατεβάστε το QR Code και εκτυπώστε το στον πίνακα ανακοινώσεων.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Κοινοποιήστε τον 4-ψήφιο κωδικό ({currentSchool.invite_code}) στις ομάδες των τμημάτων.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Νέα Ανακοίνωση
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Τίτλος *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Τίτλος..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Κατηγορία</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Γενικά">Γενικά</option>
                  <option value="Εκδηλώσεις">Εκδηλώσεις</option>
                  <option value="Αθλητισμός">Αθλητισμός</option>
                  <option value="Εκδρομές">Εκδρομές</option>                  <option value="Θέματα Σχολείου">Θέματα Σχολείου</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Περιεχόμενο *</label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Κείμενο ανακοίνωσης..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
              >
                Δημοσίευση Ανακοίνωσης
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Δημοσιευμένες Ανακοινώσεις
            </h3>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                    {ann.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{ann.content}</p>
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Νέα Εκδήλωση
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Τίτλος *</label>
                <input
                  type="text"
                  required
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="Τίτλος εκδήλωσης..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Περιγραφή *</label>
                <textarea
                  rows={3}
                  required
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  placeholder="Λεπτομέρειες..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ημερομηνία *</label>
                  <input
                    type="date"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Ώρα</label>
                  <input
                    type="text"
                    value={evtTime}
                    onChange={(e) => setEvtTime(e.target.value)}
                    placeholder="18:30"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                Προσθήκη Εκδήλωσης
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Προγραμματισμένες Εκδηλώσεις
            </h3>
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold rounded">
                    {evt.event_date} @ {evt.event_time}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900">{evt.title}</h4>
                  <p className="text-xs text-slate-500">{evt.description}</p>
                </div>

                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT IDEAS MANAGEMENT */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Προτάσεις Μαθητών
          </h3>

          <div className="space-y-3">
            {ideas.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-400">
                      Από: <strong>{item.student_name}</strong> • {new Date(item.created_at).toLocaleDateString('el-GR')}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {item.title}
                    </h4>
                  </div>
                  <IdeaStatusBadge status={ideaStatusSelected} size="md" />
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  {item.description}
                </p>

                {editingIdeaId === item.id ? (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['new', 'under_review', 'accepted', 'rejected'] as IdeaStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setIdeaStatusSelected(st)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
                            ideaStatusSelected === st
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          {st === 'new' && 'Νέα'}
                          {st === 'under_review' && 'Υπό Εξέταση'}
                          {st === 'accepted' && 'Εγκρίθηκε'}
                          {st === 'rejected' && 'Απορρίφθηκε'}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={ideaResponseText}
                      onChange={(e) => setIdeaResponseText(e.target.value)}
                      placeholder="Επίσημη απάντηση 15μελούς..."
                      className="w-full px-3 py-2 bg-white rounded-xl border text-xs"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveIdeaResponse(item.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg text-xs"
                      >
                        Αποθήκευση
                      </button>
                      <button
                        onClick={() => setEditingIdeaId(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Ακύρωση
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingIdeaId(item.id);
                      setIdeaStatusSelected(item.status);
                      setIdeaResponseText(item.admin_response || '');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Απάντηση / Κατάσταση
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEMBERS & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Εγγεγραμμένα Μέλη ({members.length})
            </h3>

            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{m.full_name}</span>
                    <span className="text-slate-400">{m.email}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      m.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.role === 'admin' ? 'Πρόεδρος' : 'Μαθητής'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              Ρυθμίσεις Προφίλ Σχολείου
            </h3>

            <form onSubmit={handleUpdateSchoolSettings} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Όνομα Σχολείου</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Περιγραφή</label>
                <textarea
                  rows={3}
                  value={schoolDesc}
                  onChange={(e) => setSchoolDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
              >
                Αποθήκευση Αλλαγών
              </button>
            </form>
          </div>
        </div>
      )}

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        inviteCode={currentSchool.invite_code}
        schoolName={currentSchool.name}
      />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Φόρτωση...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
