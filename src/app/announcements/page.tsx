'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Megaphone, Search, Pin, Clock, Tag, User } from 'lucide-react';

export default function AnnouncementsPage() {
  const { announcements } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Όλα');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Όλα', 'Γενικά', 'Εκδηλώσεις', 'Αθλητισμός', 'Εκδρομές', 'Θέματα Σχολείου'];

  const filtered = announcements.filter((item) => {
    const matchesCategory = selectedCategory === 'Όλα' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
          <Megaphone className="w-4 h-4" />
          Επίσημη Ενημέρωση Σχολείου
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Ανακοινώσεις & Νέα 15μελούς
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Δείτε όλες τις επίσημες ανακοινώσεις, εκδρομές και θέματα της μαθητικής κοινότητας.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Αναζήτηση ανακοίνωσης..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Feed List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
            <p className="text-slate-500 text-sm">Δεν βρέθηκαν ανακοινώσεις στην επιλεγμένη κατηγορία.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {item.category}
                  </span>
                  {item.is_pinned && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-800" /> Καρφιτσωμένο
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString('el-GR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              {item.image_url && (
                <div className="rounded-2xl overflow-hidden max-h-96 mt-4 border border-slate-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  Συντάκτης: <strong>{item.author_name}</strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
