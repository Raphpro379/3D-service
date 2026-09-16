import React, { useMemo, useState } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';
import { DeviceMode } from '../types';

interface PreviewFrameProps {
  code: string;
  deviceMode: DeviceMode;
  onRefresh: () => void;
  refreshKey: number;
  onOpenTemplates: () => void;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  code,
  deviceMode,
  onRefresh,
  refreshKey,
  onOpenTemplates,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Inject logger script to intercept console messages
  const processedCode = useMemo(() => {
    if (!code) return '';

    const interceptScript = `
<script>
(function() {
  function serialize(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try { return JSON.stringify(arg); } catch (e) { return String(arg); }
    }
    return String(arg);
  }
  const _log = console.log;
  const _warn = console.warn;
  const _error = console.error;

  console.log = function(...args) {
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'log', message: args.map(serialize).join(' ') }, '*');
    _log.apply(console, args);
  };
  console.warn = function(...args) {
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'warn', message: args.map(serialize).join(' ') }, '*');
    _warn.apply(console, args);
  };
  console.error = function(...args) {
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: args.map(serialize).join(' ') }, '*');
    _error.apply(console, args);
  };
  window.addEventListener('error', function(e) {
    window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: (e.message || 'Erreur d\\'exécution') + ' à ' + (e.filename || 'script') + ':' + e.lineno }, '*');
  });
})();
</script>
`;

    // Inject before </head> or at beginning
    if (code.includes('</head>')) {
      return code.replace('</head>', `${interceptScript}</head>`);
    } else if (code.includes('<body')) {
      return `${interceptScript}${code}`;
    }
    return `${interceptScript}${code}`;
  }, [code]);

  const handleOpenExternal = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (!code) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center">
        <div className="max-w-md space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-sky-400 mx-auto flex items-center justify-center shadow-xl">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Aucune application n'est chargée</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Tapez une consigne dans l'assistant à gauche pour générer votre première application web, ou sélectionnez un modèle préconçu pour démarrer immédiatement.
            </p>
          </div>
          <button
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-sky-600/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explorer les modèles prêts à l'emploi</span>
          </button>
        </div>
      </div>
    );
  }

  // Device width classes
  const getContainerStyles = () => {
    if (isFullscreen) return "w-full h-full";
    switch (deviceMode) {
      case 'mobile':
        return "w-[390px] h-[844px] max-h-[92%] rounded-[40px] border-[10px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-700/50";
      case 'tablet':
        return "w-[768px] h-[1024px] max-h-[95%] rounded-[28px] border-[12px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-700/50";
      case 'desktop':
      default:
        return "w-full h-full";
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-slate-950 ${
        isFullscreen ? 'fixed inset-0 z-50 p-0' : 'h-full p-2 sm:p-4 overflow-hidden'
      }`}
    >
      {/* Mini floating toolbar inside preview */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 px-2 py-1 rounded-xl shadow-lg text-xs">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Recharger l'application"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleOpenExternal}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Ouvrir dans une nouvelle fenêtre"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Frame Container */}
      <div className={`transition-all duration-300 flex flex-col bg-white ${getContainerStyles()}`}>
        {/* Device Notch / Camera if mobile or tablet */}
        {deviceMode === 'mobile' && !isFullscreen && (
          <div className="h-6 bg-slate-950 w-full flex items-center justify-center shrink-0">
            <div className="w-20 h-3 bg-slate-800 rounded-full"></div>
          </div>
        )}

        <iframe
          key={refreshKey}
          srcDoc={processedCode}
          title="Application Preview"
          sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-downloads allow-popups"
          className="w-full h-full border-0 bg-white"
        />
      </div>
    </div>
  );
};
