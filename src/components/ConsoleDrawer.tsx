import React, { useState } from 'react';
import { Terminal, Trash2, ChevronUp, ChevronDown, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { ConsoleLogMessage } from '../types';

interface ConsoleDrawerProps {
  logs: ConsoleLogMessage[];
  onClearLogs: () => void;
}

export const ConsoleDrawer: React.FC<ConsoleDrawerProps> = ({ logs, onClearLogs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount = logs.filter(l => l.type === 'warn').length;

  const filteredLogs = logs.filter(l => {
    if (filter === 'all') return true;
    return l.type === filter;
  });

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur z-20 shrink-0">
      {/* Drawer Bar */}
      <div className="h-9 px-4 flex items-center justify-between select-none text-xs border-b border-slate-800/60">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-medium transition"
        >
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span>Console Développeur</span>
          {errorCount > 0 && (
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-1.5 py-0.2 rounded font-bold">
              {errorCount} {errorCount === 1 ? 'erreur' : 'erreurs'}
            </span>
          )}
          {warnCount > 0 && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.2 rounded">
              {warnCount}
            </span>
          )}
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
        </button>

        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px]">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded ${filter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
              >
                Tous ({logs.length})
              </button>
              <button
                onClick={() => setFilter('error')}
                className={`px-2 py-0.5 rounded ${filter === 'error' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-slate-400'}`}
              >
                Erreurs ({errorCount})
              </button>
              <button
                onClick={() => setFilter('warn')}
                className={`px-2 py-0.5 rounded ${filter === 'warn' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-slate-400'}`}
              >
                Warn ({warnCount})
              </button>
            </div>

            <button
              onClick={onClearLogs}
              className="text-slate-400 hover:text-rose-400 p-1 rounded transition"
              title="Effacer les journaux"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Drawer Content */}
      {isOpen && (
        <div className="h-40 overflow-y-auto p-3 font-mono text-[11px] space-y-1 bg-slate-950">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 italic py-4 text-center">
              Aucun message ou journal pour l'instant. Les 'console.log' et erreurs du bac à sable s'afficheront ici.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-2 p-1.5 rounded ${
                  log.type === 'error'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    : log.type === 'warn'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {log.type === 'error' ? (
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                  ) : log.type === 'warn' ? (
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                  ) : (
                    <Info className="w-3 h-3 text-sky-400" />
                  )}
                </span>
                <span className="text-slate-500 text-[10px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="break-all whitespace-pre-wrap">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
