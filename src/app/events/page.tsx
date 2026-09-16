'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar as CalendarIcon, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function EventsPage() {
  const { events } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">
          <CalendarIcon className="w-4 h-4" />
          Ημερολόγιο Σχολικής Ζωής
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Εκδηλώσεις & Δράσεις Σχολείου
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Δείτε τις προγραμματισμένες εκδηλώσεις, τουρνουά, θεατρικές παραστάσεις και ημερίδες.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => {
          const dateObj = new Date(evt.event_date);
          const day = dateObj.getDate();
          const month = dateObj.toLocaleDateString('el-GR', { month: 'short' });

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col"
            >
              {evt.cover_image_url && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={evt.cover_image_url}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 rounded-2xl px-3 py-1.5 shadow-md text-center font-bold">
                    <span className="block text-xl text-indigo-600 font-black leading-none">{day}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">{month}</span>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {evt.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      Ώρα: {evt.event_time || '10:00'}
                    </span>
                    {evt.location && (
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        {evt.location}
                      </span>
                    )}
                  </div>

                  {evt.external_link && (
                    <a
                      href={evt.external_link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      Περισσότερες Πληροφορίες / Εγγραφή
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
