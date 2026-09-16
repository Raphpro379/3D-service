import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptPanel } from './components/PromptPanel';
import { PreviewFrame } from './components/PreviewFrame';
import { CodeViewer } from './components/CodeViewer';
import { ConsoleDrawer } from './components/ConsoleDrawer';
import { TemplateGallery } from './components/TemplateGallery';
import { VersionHistory } from './components/VersionHistory';
import { PublishModal } from './components/PublishModal';
import { TEMPLATES, TemplatePreset } from './data/templates';
import { 
  DeviceMode, 
  ViewMode, 
  ChatMessage, 
  AppVersion, 
  GenerationOptions,
  ConsoleLogMessage,
  PublishedApp
} from './types';

export default function App() {
  // Primary App State
  const [currentCode, setCurrentCode] = useState<string>("");
  const [appTitle, setAppTitle] = useState<string>("FinTrack Budget");
  const [appDescription, setAppDescription] = useState<string>("Application de gestion financière");
  const [version, setVersion] = useState<number>(1);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | undefined>("fintrack-budget");

  // UI Control State
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modals State
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [publishedApp, setPublishedApp] = useState<PublishedApp | null>(null);

  // Chat & History State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMessage[]>([]);

  // Initialize with the first template or imported published app or saved code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const importPubId = params.get('import_pub');

    if (importPubId) {
      fetch(`/api/publish/${importPubId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.app) {
            setCurrentCode(data.app.code);
            setAppTitle(data.app.title);
            setAppDescription(data.app.description || "");
            setVersion(1);
            setPublishedApp(data.app);

            const importMsg: ChatMessage = {
              id: 'import-' + Date.now(),
              role: 'assistant',
              content: `Application publiée "${data.app.title}" chargée dans le Studio avec succès !\n\nVous pouvez l'éditer, lui apporter des modifications avec l'IA et mettre à jour sa publication en direct.`,
              timestamp: Date.now(),
              codeSnapshot: data.app.code,
            };
            setMessages([importMsg]);
            setVersions([
              {
                id: `v-pub-${Date.now()}`,
                version: 1,
                title: data.app.title,
                prompt: "Application publiée importée",
                code: data.app.code,
                timestamp: Date.now(),
                explanation: "Chargée depuis le lien public",
              }
            ]);
            return;
          }
        })
        .catch((err) => console.error("Could not load imported published app:", err));
    }

    const saved = localStorage.getItem('webcraft_current_project');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.code) {
          setCurrentCode(parsed.code);
          setAppTitle(parsed.title || "Mon Application Web");
          setAppDescription(parsed.description || "");
          setVersion(parsed.version || 1);
          setMessages(parsed.messages || []);
          setVersions(parsed.versions || []);
          if (parsed.publishedApp) {
            setPublishedApp(parsed.publishedApp);
          }
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved project:", e);
      }
    }

    // Default to the first template
    const defaultTmpl = TEMPLATES[0];
    setCurrentCode(defaultTmpl.initialCode);
    setAppTitle(defaultTmpl.title);
    setAppDescription(defaultTmpl.description);
    setVersion(1);
    setCurrentTemplateId(defaultTmpl.id);
    
    const initialMsg: ChatMessage = {
      id: 'init-1',
      role: 'assistant',
      content: `Bienvenue sur le Créateur d'Applications Web IA ! J'ai préchargé le modèle "${defaultTmpl.title}".\n\nVous pouvez le tester immédiatement dans l'aperçu à droite, ou m'indiquer vos souhaits d'améliorations (ex: "Ajoute un graphique circulaire", "Permets d'exporter en PDF ou CSV", "Passe en mode sombre").`,
      timestamp: Date.now(),
      suggestedImprovements: [
        "Ajouter un graphique de répartition",
        "Ajouter un export en CSV",
        "Passer en thème bleu nuit & violet",
        "Ajouter un simulateur d'épargne"
      ],
      codeSnapshot: defaultTmpl.initialCode
    };

    setMessages([initialMsg]);
    setVersions([
      {
        id: 'v-1',
        version: 1,
        title: defaultTmpl.title,
        prompt: defaultTmpl.prompt,
        code: defaultTmpl.initialCode,
        timestamp: Date.now(),
        explanation: "Modèle initial prêt à l'emploi"
      }
    ]);
  }, []);

  // Persist current project to localStorage
  useEffect(() => {
    if (!currentCode) return;
    try {
      const dataToSave = {
        code: currentCode,
        title: appTitle,
        description: appDescription,
        version,
        messages,
        versions,
        publishedApp,
      };
      localStorage.setItem('webcraft_current_project', JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Storage full or quota exceeded", e);
    }
  }, [currentCode, appTitle, appDescription, version, messages, versions, publishedApp]);

  // Listen to sandbox iframe console logs
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        const newLog: ConsoleLogMessage = {
          id: Math.random().toString(36).substring(2, 9),
          type: event.data.level || 'log',
          message: event.data.message || '',
          timestamp: Date.now(),
        };
        setConsoleLogs((prev) => [...prev.slice(-100), newLog]);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Handle AI generation or update
  const handleGenerate = async (promptText: string, options: GenerationOptions) => {
    setIsGenerating(true);

    // Append user message to chat
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          currentCode: currentCode || "",
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de la génération par l'IA");
      }

      const newCode = data.code || currentCode;
      const newVersionNum = version + 1;
      const newTitle = data.title || appTitle;
      const newDesc = data.description || appDescription;

      setCurrentCode(newCode);
      setAppTitle(newTitle);
      setAppDescription(newDesc);
      setVersion(newVersionNum);
      setRefreshKey((k) => k + 1);

      // AI Response message
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: data.explanation || `J'ai mis à jour "${newTitle}" selon vos consignes.`,
        timestamp: Date.now(),
        suggestedImprovements: data.suggestedImprovements || [
          "Ajouter le mode sombre",
          "Ajouter la persistance locale",
          "Améliorer les animations"
        ],
        codeSnapshot: newCode
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Add to version history
      const newVer: AppVersion = {
        id: `v-${newVersionNum}`,
        version: newVersionNum,
        title: newTitle,
        prompt: promptText,
        code: newCode,
        timestamp: Date.now(),
        explanation: data.explanation
      };
      setVersions((prev) => [...prev, newVer]);

    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: `⚠️ Une erreur est survenue : ${err.message || 'Impossible de joindre le service de génération'}.\n\nVous pouvez réessayer ou ajuster votre prompt.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: TemplatePreset) => {
    setCurrentCode(template.initialCode);
    setAppTitle(template.title);
    setAppDescription(template.description);
    setVersion(1);
    setCurrentTemplateId(template.id);
    setRefreshKey((k) => k + 1);

    const tmplMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: `Modèle chargé : "${template.title}".\n\n${template.description}\n\nVous pouvez l'utiliser directement ou me demander d'y ajouter des fonctionnalités !`,
      timestamp: Date.now(),
      suggestedImprovements: [
        "Personnaliser les couleurs",
        "Ajouter un graphique",
        "Ajouter un filtre de recherche",
        "Ajouter une exportation"
      ],
      codeSnapshot: template.initialCode
    };
    setMessages([tmplMsg]);

    setVersions([
      {
        id: `v-1-${Date.now()}`,
        version: 1,
        title: template.title,
        prompt: template.prompt,
        code: template.initialCode,
        timestamp: Date.now(),
        explanation: "Modèle préconçu prêt à l'emploi"
      }
    ]);
  };

  // Handle manual code modification
  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    setRefreshKey((k) => k + 1);
  };

  // Download standalone HTML
  const handleDownloadHtml = () => {
    if (!currentCode) return;
    const blob = new Blob([currentCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'web-app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy code to clipboard
  const handleCopyCode = async () => {
    if (!currentCode) return;
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Open in new browser tab
  const handleOpenNewTab = () => {
    if (!currentCode) return;
    const blob = new Blob([currentCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Reset to fresh new project
  const handleNewProject = () => {
    if (confirm("Voulez-vous démarrer un nouveau projet vide ?")) {
      setCurrentCode("");
      setAppTitle("Nouvelle Application");
      setAppDescription("");
      setVersion(1);
      setCurrentTemplateId(undefined);
      setPublishedApp(null);
      setMessages([]);
      setVersions([]);
      setConsoleLogs([]);
      localStorage.removeItem('webcraft_current_project');
    }
  };

  // Published handlers
  const handleAppPublished = (app: PublishedApp) => {
    setPublishedApp(app);
    const pubMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: `🚀 Félicitations ! Votre application "${app.title}" est maintenant publiée en direct sur le web !\n\n🔗 **Lien public accessible partout** :\n${app.url}\n\nVous pouvez partager cette URL, l'intégrer sur un site web avec iframe ou la tester sur mobile.`,
      timestamp: Date.now(),
      suggestedImprovements: [
        "Mettre à jour la publication en ligne",
        "Ajouter le mode sombre",
        "Ajouter une option de partage"
      ]
    };
    setMessages((prev) => [...prev, pubMsg]);
  };

  const handleAppUnpublished = (id: string) => {
    if (publishedApp?.id === id) {
      setPublishedApp(null);
    }
  };

  // Restore previous version
  const handleRestoreVersion = (ver: AppVersion) => {
    setCurrentCode(ver.code);
    setAppTitle(ver.title);
    setVersion(ver.version);
    setRefreshKey((k) => k + 1);

    const restoreMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'assistant',
      content: `Version ${ver.version} ("${ver.title}") restaurée avec succès !`,
      timestamp: Date.now(),
      codeSnapshot: ver.code
    };
    setMessages((prev) => [...prev, restoreMsg]);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Header
        appTitle={appTitle}
        version={version}
        viewMode={viewMode}
        setViewMode={setViewMode}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onRefreshPreview={() => setRefreshKey((k) => k + 1)}
        onDownloadHtml={handleDownloadHtml}
        onCopyCode={handleCopyCode}
        copied={copied}
        onOpenTemplates={() => setIsTemplateGalleryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewProject={handleNewProject}
        onOpenNewTab={handleOpenNewTab}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        isPublished={Boolean(publishedApp)}
        hasCode={Boolean(currentCode)}
        isGenerating={isGenerating}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: AI Prompt & Iteration Panel */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className={`${viewMode === 'code' ? 'w-80 hidden lg:flex' : 'w-full md:w-[420px] lg:w-[460px]'} flex-col shrink-0 h-full`}>
            <PromptPanel
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              messages={messages}
              hasCode={Boolean(currentCode)}
              onApplySuggestion={(sug) => handleGenerate(sug, { style: "Moderne & Épuré", features: ["Sauvegarde LocalStorage"] })}
              onRestoreCode={(code, note) => {
                setCurrentCode(code);
                setRefreshKey((k) => k + 1);
              }}
              currentTitle={appTitle}
            />
          </div>
        )}

        {/* Right: Main Viewport (Preview or Code Editor) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
          {viewMode === 'code' ? (
            <CodeViewer
              code={currentCode}
              onCodeChange={handleCodeChange}
              onDownload={handleDownloadHtml}
              appTitle={appTitle}
            />
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <PreviewFrame
                  code={currentCode}
                  deviceMode={deviceMode}
                  onRefresh={() => setRefreshKey((k) => k + 1)}
                  refreshKey={refreshKey}
                  onOpenTemplates={() => setIsTemplateGalleryOpen(true)}
                />
              </div>

              {/* Developer Console Drawer */}
              <ConsoleDrawer
                logs={consoleLogs}
                onClearLogs={() => setConsoleLogs([])}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TemplateGallery
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentTemplateId={currentTemplateId}
      />

      <VersionHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versions}
        currentVersion={version}
        onSelectVersion={handleRestoreVersion}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        appTitle={appTitle}
        appDescription={appDescription}
        code={currentCode}
        publishedApp={publishedApp}
        onAppPublished={handleAppPublished}
        onAppUnpublished={handleAppUnpublished}
      />
    </div>
  );
}
