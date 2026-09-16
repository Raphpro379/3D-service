import React from 'react';
import { X, History, RotateCcw, Check, Sparkles, Clock } from 'lucide-react';
import { AppVersion } from '../types';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: AppVersion[];
  currentVersion: number;
  onSelectVersion: (version: AppVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersion,
  onSelectVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Historique des itérations</h2>
              <p className="text-xs text-slate-400">Revenez en arrière sur n'importe quelle version précédente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Versions List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {versions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Aucune version enregistrée dans cette session.
            </div>
          ) : (
            versions.map((ver) => {
              const isCurrent = ver.version === currentVersion;
              return (
                <div
                  key={ver.id}
                  className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                    isCurrent
                      ? 'bg-sky-500/10 border-sky-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-800 text-slate-200 px-2 py-0.5 rounded">
                        v{ver.version}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {ver.title || 'Version ' + ver.version}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                          Actuelle
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      "{ver.prompt}"
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ver.timestamp).toLocaleTimeString()}</span>
                      {ver.explanation && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 truncate max-w-[280px]">{ver.explanation}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isCurrent ? (
                    <button
                      onClick={() => {
                        onSelectVersion(ver);
                        onClose();
                      }}
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurer</span>
                    </button>
                  ) : (
                    <span className="shrink-0 p-1.5 text-sky-400">
                      <Check className="w-5 h-5" />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
