import React from 'react';
import { X, Sparkles, ArrowRight, Wallet, LayoutList, Clock, Check, Box } from 'lucide-react';
import { TEMPLATES, TemplatePreset } from '../data/templates';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplatePreset) => void;
  currentTemplateId?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="w-5 h-5 text-sky-400" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-emerald-400" />;
      case 'LayoutList':
        return <LayoutList className="w-5 h-5 text-indigo-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-orange-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Modèles d'applications préconçus</h2>
              <p className="text-xs text-slate-400">Démarrez instantanément avec une application interactive ou demandez à l'IA de la personnaliser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((tmpl) => {
            const isCurrent = tmpl.id === currentTemplateId;
            return (
              <div
                key={tmpl.id}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {getIcon(tmpl.icon)}
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                      {tmpl.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-sky-300 transition">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Prêt à l'emploi</span>
                  <button
                    onClick={() => {
                      onSelectTemplate(tmpl);
                      onClose();
                    }}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition ${
                      isCurrent
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-sky-400" />
                        <span>Actif</span>
                      </>
                    ) : (
                      <>
                        <span>Charger</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-400">
          Astuce : Après avoir chargé un modèle, vous pouvez demander à l'IA d'ajouter de nouvelles fonctionnalités via le chat !
        </div>
      </div>
    </div>
  );
};
