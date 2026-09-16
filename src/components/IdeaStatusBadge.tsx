import React from 'react';
import { IdeaStatus } from '@/types';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface IdeaStatusBadgeProps {
  status: IdeaStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const IdeaStatusBadge: React.FC<IdeaStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-4 py-1.5 text-base font-semibold',
  };

  switch (status) {
    case 'new':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Νέα Υποβολή
        </span>
      );
    case 'under_review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 font-semibold ${sizeClasses[size]}`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Υπό Εξέταση
        </span>
      );
    case 'accepted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold ${sizeClasses[size]}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Εγκρίθηκε
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 font-semibold ${sizeClasses[size]}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Απορρίφθηκε
        </span>
      );
    default:
      return null;
  }
};
