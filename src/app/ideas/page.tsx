'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IdeaCategory } from '@/types';
import { IdeaStatusBadge } from '@/components/IdeaStatusBadge';
import { Lightbulb, PlusCircle, Send, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function IdeasPage() {
  const { user, ideas, submitIdea } = useAuth();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('Γενικά');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const isAdmin = user?.role === 'admin';
  const studentIdeas = ideas.filter((item) => item.student_uid === user?.uid || isAdmin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    submitIdea({
      title,
      description,
      category,
    });

    setTitle('');
    setDescription('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
    }, 1500);
  };

  const categoryOptions: IdeaCategory[] = ['Γενικά', 'Υποδομές', 'Εκδηλώσεις', 'Περιβάλλον', 'Αθλητισμός', 'Μαθήματα'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold">
            <Lightbulb className="w-4 h-4" />
            Φωνή Μαθητή & Προτάσεις 15μελούς
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isAdmin ? 'Προτάσεις Μαθητών' : 'Οι Προτάσεις μου'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAdmin
              ? 'Δείτε τις προτάσεις που έχουν υποβληθεί από τους μαθητές του σχολείου.'
              : 'Υποβάλετε ιδέες για τη βελτίωση του σχολείου. Μόνο εσείς και το 15μελές βλέπετε τις προτάσεις σας.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin?tab=ideas"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" /> Διαχείριση Προτάσεων
            </Link>
          )}

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-xs flex items-center gap-2 text-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            Νέα Πρόταση
          </button>
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {studentIdeas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <Lightbulb className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Δεν έχετε υποβάλει κάποια πρόταση ακόμα</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Πατήστε το κουμπί &quot;Νέα Πρόταση&quot; για να στείλετε την ιδέα σας στο 15μελές συμβούλιο!
            </p>
          </div>
        ) : (
          studentIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                      {idea.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(idea.created_at).toLocaleDateString('el-GR')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">
                    {idea.title}
                  </h3>
                </div>
                <IdeaStatusBadge status={idea.status} size="md" />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {idea.description}
              </p>

              {idea.admin_response && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    Απάντηση 15μελούς Συμβουλίου:
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pl-5">
                    {idea.admin_response}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Idea Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Υποβολή Νέας Πρότασης
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Η πρότασή σου στάλθηκε!</h4>
                <p className="text-xs text-slate-500">Το 15μελές θα την εξετάσει σύντομα.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Τίτλος Πρότασης *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="π.χ. Εγκατάσταση κάδων ανακύκλωσης"
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Κατηγορία
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Περιγραφή & Λεπτομέρειες *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Εξηγήστε την ιδέα σας και πώς θα βοηθήσει το σχολείο..."
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Ακύρωση
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-4 h-4" /> Υποβολή
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
