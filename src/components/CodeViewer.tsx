import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, Edit3, CheckCircle2, RotateCcw, Search } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onDownload: () => void;
  appTitle: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  onCodeChange,
  onDownload,
  appTitle,
}) => {
  const [editableCode, setEditableCode] = useState(code);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setEditableCode(code);
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyChanges = () => {
    onCodeChange(editableCode);
    setIsEditing(false);
  };

  const handleReset = () => {
    setEditableCode(code);
    setIsEditing(false);
  };

  const lines = editableCode.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs">
      {/* Code Header Toolbar */}
      <div className="h-11 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold text-xs">index.html</span>
          <span className="text-[10px] text-slate-500 font-sans">
            ({lines.length} lignes • {(editableCode.length / 1024).toFixed(1)} Ko)
          </span>
          {isEditing && (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-sans">
              Mode Édition actif
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Toggle */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5 font-sans text-xs"
              title="Modifier manuellement le code"
            >
              <Edit3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Modifier</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition font-sans text-xs"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyChanges}
                className="px-3 py-1 rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition flex items-center gap-1 font-sans text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Appliquer</span>
              </button>
            </>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5 font-sans text-xs"
            title="Copier le code dans le presse-papier"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="px-2.5 py-1 rounded-lg text-white bg-sky-600 hover:bg-sky-500 transition flex items-center gap-1.5 font-sans text-xs"
            title="Télécharger le fichier index.html"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Code Editor or Viewer Body */}
      <div className="flex-1 overflow-hidden relative flex">
        {isEditing ? (
          <textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-sky-500/30"
            spellCheck={false}
          />
        ) : (
          <div className="flex-1 overflow-auto flex select-text">
            {/* Line numbers column */}
            <div className="py-4 pl-3 pr-3 text-right bg-slate-950/90 text-slate-600 select-none border-r border-slate-800/80 sticky left-0">
              {lines.map((_, i) => (
                <div key={i} className="leading-relaxed h-5 text-[11px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code lines */}
            <div className="p-4 flex-1 text-slate-300 overflow-x-auto">
              <pre className="font-mono text-xs leading-relaxed whitespace-pre">
                {editableCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
