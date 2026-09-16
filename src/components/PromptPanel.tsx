import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Wand2, 
  Lightbulb, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  RotateCcw,
  Code,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, GenerationOptions } from '../types';

interface PromptPanelProps {
  onGenerate: (prompt: string, options: GenerationOptions) => void;
  isGenerating: boolean;
  messages: ChatMessage[];
  hasCode: boolean;
  onApplySuggestion: (suggestion: string) => void;
  onRestoreCode: (code: string, versionNote: string) => void;
  currentTitle: string;
}

const QUICK_PROMPTS = [
  "Scène 3D interactive avec Three.js et contrôle orbital",
  "Système solaire 3D animé avec orbites et zoom",
  "Tableau Kanban avec colonnes et drag & drop",
  "Calculateur de budget personnel avec graphiques",
  "Minuteur Pomodoro avec sons et suivi des sessions",
  "Générateur de quiz interactif avec score",
  "Gestionnaire de notes Markdown avec prévisualisation",
  "Simulateur de météo interactive avec prévisions",
];

const STYLE_OPTIONS = [
  { id: "Moderne & Épuré", label: "Moderne & Épuré", desc: "Minimaliste, spacieux et soigné" },
  { id: "3D & Immersif", label: "3D & Immersif", desc: "WebGL / Three.js avec éclairages dynamiques" },
  { id: "Dark Glassmorphism", label: "Dark Glass", desc: "Palette sombre avec reflets subtils" },
  { id: "Dashboard Métrique", label: "Dashboard Pro", desc: "Cartes denses, graphiques et métriques" },
  { id: "Pastel Doux", label: "Pastel Doux", desc: "Couleurs claires et conviviales" },
];

export const PromptPanel: React.FC<PromptPanelProps> = ({
  onGenerate,
  isGenerating,
  messages,
  hasCode,
  onApplySuggestion,
  onRestoreCode,
  currentTitle,
}) => {
  const [prompt, setPrompt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Sauvegarde LocalStorage",
    "Animations fluides"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), {
      style: selectedStyle,
      features: selectedFeatures
    });
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border-r border-slate-800/80">
      {/* Messages / Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4 max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/5">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Que voulez-vous créer aujourd'hui ?</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Décrivez votre application web en langage naturel. Gemini 3 générera une application complète avec interface moderne et fonctionnalités interactives.
              </p>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="w-full space-y-2 pt-2 text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Idées instantanées
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(qp);
                      textareaRef.current?.focus();
                    }}
                    className="text-left text-xs bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between group"
                  >
                    <span>{qp}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-sky-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-slate-500 mb-1 px-1 flex items-center gap-1">
                {msg.role === 'user' ? (
                  <span>Vous</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>Architecte IA</span>
                  </>
                )}
              </div>
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Suggestions pills if provided by AI */}
                {msg.suggestedImprovements && msg.suggestedImprovements.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                      <Flame className="w-3 h-3 text-orange-400" /> Améliorations recommandées :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedImprovements.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => onApplySuggestion(sug)}
                          disabled={isGenerating}
                          className="text-[11px] bg-slate-950/80 hover:bg-slate-800 text-sky-300 border border-sky-500/20 hover:border-sky-500/40 px-2.5 py-1 rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                        >
                          <span>+ {sug}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rollback button if message has code snapshot */}
                {msg.codeSnapshot && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => onRestoreCode(msg.codeSnapshot!, msg.content.slice(0, 30))}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800 hover:bg-slate-800 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Restaurer cette version
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex flex-col items-start space-y-2">
            <div className="text-[10px] text-slate-500 px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400 animate-spin" />
              <span>Génération en cours...</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 w-full max-w-[90%] space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"></div>
                <span className="font-medium text-slate-100">Gemini 3 compile votre application...</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Création des composants HTML, application de Tailwind CSS, injection des icônes et programmation des scripts interactifs.
              </p>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 h-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Configuration Drawer Toggle */}
      <div className="border-t border-slate-800/80 px-4 py-2 bg-slate-900/40">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition py-1"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            Paramètres de style & options ({selectedStyle})
          </span>
          {showOptions ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {showOptions && (
          <div className="pt-2 pb-1 space-y-3 border-t border-slate-800/60 mt-2">
            {/* Style Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Style d'interface :</label>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`text-left p-2 rounded-xl text-xs border transition ${
                      selectedStyle === style.id
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="font-medium text-[11px]">{style.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Checkboxes */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Fonctionnalités souhaitées :</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Sauvegarde LocalStorage",
                  "Animations fluides",
                  "Exportation de données",
                  "Effets sonores Web Audio",
                  "Graphiques interactifs",
                  "Filtres de recherche",
                ].map((feat) => {
                  const isChecked = selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition flex items-center gap-1 ${
                        isChecked
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-medium'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                      <span>{feat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950 relative">
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-sky-500/60 focus-within:ring-1 focus-within:ring-sky-500/20 transition shadow-inner">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={
              hasCode
                ? "Ex: Ajoute un filtre par date, passe le thème en vert émeraude, rends le solde exportable..."
                : "Décrivez l'application web de vos rêves (ex: Dashboard CRM, Jeu de réflexes, Outil de calcul...)"
            }
            rows={3}
            className="w-full bg-transparent px-3.5 py-3 text-xs text-slate-100 placeholder-slate-500 resize-none focus:outline-none disabled:opacity-50"
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60 text-[11px] text-slate-500">
            <span>Shift + Entrée pour retour à la ligne</span>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white disabled:text-slate-500 font-medium px-3.5 py-1.5 rounded-xl transition shadow-md shadow-sky-600/20 flex items-center gap-1.5 disabled:shadow-none"
            >
              <span>{hasCode ? "Mettre à jour" : "Générer"}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
