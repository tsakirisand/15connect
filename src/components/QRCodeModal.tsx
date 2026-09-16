'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Download, QrCode, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  schoolName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, inviteCode, schoolName }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register?role=student&code=${inviteCode}`
    : `https://15connect.gr/register?role=student&code=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadQR = () => {
    const svgElement = document.getElementById('school-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 100, 100, 800, 800);
      }

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_Code_${inviteCode}_15Connect.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Πρόσκληση Μαθητών στο 15μελές
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {schoolName}
          </p>
        </div>

        <div className="bg-blue-50/60 p-6 rounded-2xl flex flex-col items-center justify-center border border-blue-100 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100">
            <QRCodeSVG
              id="school-qr-svg"
              value={joinUrl}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-xs font-medium text-slate-500 mt-3 text-center">
            Σκανάρετε το QR code με την κάμερα του κινητού
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Κωδικός Πρόσκλησης
              </span>
              <span className="text-2xl font-black tracking-widest text-blue-600 font-mono">
                {inviteCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Αντιγράφηκε' : 'Αντιγραφή'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={joinUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'OK' : 'Link'}
            </button>
          </div>
        </div>

        <button
          onClick={handleDownloadQR}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition text-xs"
        >
          <Download className="w-4 h-4" />
          Λήψη QR Code (Εικόνα PNG)
        </button>
      </div>
    </div>
  );
};
