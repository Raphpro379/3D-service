import React from 'react';
import { 
  Sparkles, 
  Box,
  Monitor, 
  Tablet, 
  Smartphone, 
  Code2, 
  Eye, 
  Columns, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  LayoutTemplate,
  History,
  ExternalLink,
  Plus,
  Globe
} from 'lucide-react';
import { DeviceMode, ViewMode } from '../types';

interface HeaderProps {
  appTitle: string;
  version: number;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (d: DeviceMode) => void;
  onRefreshPreview: () => void;
  onDownloadHtml: () => void;
  onCopyCode: () => void;
  copied: boolean;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
  onNewProject: () => void;
  onOpenNewTab: () => void;
  onOpenPublish: () => void;
  isPublished?: boolean;
  hasCode: boolean;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  appTitle,
  version,
  viewMode,
  setViewMode,
  deviceMode,
  setDeviceMode,
  onRefreshPreview,
  onDownloadHtml,
  onCopyCode,
  copied,
  onOpenTemplates,
  onOpenHistory,
  onNewProject,
  onOpenNewTab,
  onOpenPublish,
  isPublished = false,
  hasCode,
  isGenerating,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left Branding & Project Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Box className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-100 tracking-tight flex items-center gap-1">
                <span>R</span>
                <span className="text-sky-400">3D</span>
                <span>Studio</span>
              </span>
              <span className="text-[10px] uppercase font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.2 rounded">
                Gemini 3
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

        {/* Current App Info */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300 max-w-[180px] truncate" title={appTitle}>
            {appTitle || "Nouvelle Application"}
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
            v{version}
          </span>
        </div>
      </div>

      {/* Center: View Mode & Viewport Controls */}
      <div className="flex items-center gap-2">
        {/* View mode toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
              viewMode === 'split' ? 'bg-slate-800 text-slate-100 font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Écran partagé (Assistant + Rendu)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Partagé</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
              viewMode === 'preview' ? 'bg-slate-800 text-slate-100 font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Aperçu plein écran"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Aperçu</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
              viewMode === 'code' ? 'bg-slate-800 text-slate-100 font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Inspecter le code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Code</span>
          </button>
        </div>

        {/* Device Switcher (visible in preview & split) */}
        {viewMode !== 'code' && (
          <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md transition ${deviceMode === 'desktop' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
              title="Ordinateur (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-md transition ${deviceMode === 'tablet' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
              title="Tablette (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md transition ${deviceMode === 'mobile' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
              title="Mobile (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">
        {/* New Project */}
        <button
          onClick={onNewProject}
          className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/80 transition flex items-center gap-1.5"
          title="Nouveau projet"
        >
          <Plus className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Nouveau</span>
        </button>

        {/* Templates Gallery */}
        <button
          onClick={onOpenTemplates}
          className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/80 transition flex items-center gap-1.5"
          title="Modèles d'inspiration"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Modèles</span>
        </button>

        {/* History */}
        <button
          onClick={onOpenHistory}
          className="text-xs text-slate-300 hover:text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/80 transition flex items-center gap-1.5"
          title="Historique des versions"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Historique</span>
        </button>

        {hasCode && (
          <>
            {/* Refresh */}
            <button
              onClick={onRefreshPreview}
              className="text-xs text-slate-300 hover:text-white p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
              title="Recharger l'aperçu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Copy code */}
            <button
              onClick={onCopyCode}
              className="text-xs text-slate-300 hover:text-white p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
              title="Copier le code HTML"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Download standalone HTML */}
            <button
              onClick={onDownloadHtml}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition flex items-center gap-1.5"
              title="Télécharger en fichier HTML autonome"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Export</span>
            </button>

            {/* Open in new tab */}
            <button
              onClick={onOpenNewTab}
              className="text-xs text-slate-300 hover:text-white p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition"
              title="Ouvrir l'aperçu dans un nouvel onglet"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Publish Button */}
            <button
              onClick={onOpenPublish}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-md flex items-center gap-1.5 ${
                isPublished
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20'
              }`}
              title="Publier l'application et obtenir une URL publique permanente"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isPublished ? 'En ligne' : 'Publier'}</span>
              {isPublished && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
