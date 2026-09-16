import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  Code, 
  QrCode, 
  Send, 
  Sparkles,
  Eye,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PublishedApp } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  appTitle: string;
  appDescription: string;
  code: string;
  publishedApp?: PublishedApp | null;
  onAppPublished: (app: PublishedApp) => void;
  onAppUnpublished: (id: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  appTitle,
  appDescription,
  code,
  publishedApp,
  onAppPublished,
  onAppUnpublished,
}) => {
  const [title, setTitle] = useState(appTitle);
  const [description, setDescription] = useState(appDescription);
  const [customSlug, setCustomSlug] = useState('');
  const [activeTab, setActiveTab] = useState<'publish' | 'list'>('publish');

  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // List of all published apps
  const [allPublished, setAllPublished] = useState<PublishedApp[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Synchronize initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(appTitle || 'Mon Application Web');
      setDescription(appDescription || '');
      setError(null);
      setCopiedLink(false);
      setCopiedEmbed(false);

      if (publishedApp) {
        setCustomSlug(publishedApp.slug);
      } else {
        const slugified = (appTitle || 'mon-app')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setCustomSlug(slugified);
      }

      loadPublishedList();
    }
  }, [isOpen, appTitle, appDescription, publishedApp]);

  const loadPublishedList = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch('/api/published');
      const data = await res.json();
      if (res.ok && data.apps) {
        setAllPublished(data.apps);
      }
    } catch (e) {
      console.error('Failed to load published list:', e);
    } finally {
      setIsLoadingList(false);
    }
  };

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentSlugClean = customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/(^-|-$)/g, '');
  const previewUrl = publishedApp 
    ? publishedApp.url 
    : `${currentOrigin}/p/${currentSlugClean || 'mon-app'}`;

  // Handle Publish action
  const handlePublish = async () => {
    if (!code) {
      setError("Aucun code à publier.");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: publishedApp?.id,
          title: title.trim() || 'Application Web',
          description: description.trim(),
          customSlug: currentSlugClean,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la publication');
      }

      onAppPublished(data.publishedApp);
      loadPublishedList();
    } catch (err: any) {
      setError(err.message || 'Impossible de publier');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Unpublish action
  const handleUnpublish = async (id: string) => {
    if (!confirm("Voulez-vous vraiment dépublier cette application ? Le lien public ne fonctionnera plus.")) {
      return;
    }

    try {
      const res = await fetch(`/api/publish/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onAppUnpublished(id);
        loadPublishedList();
      }
    } catch (err) {
      console.error('Failed to unpublish:', err);
    }
  };

  // Copy URL
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy Iframe embed code
  const handleCopyEmbed = (url: string) => {
    const embed = `<iframe src="${url}?embed=true" width="100%" height="700" style="border:1px solid #e2e8f0;border-radius:12px;" allow="camera; microphone; geolocation" loading="lazy"></iframe>`;
    navigator.clipboard.writeText(embed);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Publier l'application
                {publishedApp && (
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    En ligne
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Obtenez une URL publique permanente pour tester et partager votre application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('publish')}
            className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'publish'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{publishedApp ? 'Gérer la publication' : 'Nouvelle publication'}</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 ml-6 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'list'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Toutes les applications publiées ({allPublished.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'publish' ? (
            <>
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Published Success Banner */}
              {publishedApp && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Votre application est hébergée et accessible au public !</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{publishedApp.views || 0} vues</span>
                    </div>
                  </div>

                  {/* Public Link Box */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <Globe className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
                    <input
                      type="text"
                      readOnly
                      value={publishedApp.url}
                      className="bg-transparent text-xs text-sky-300 font-mono flex-1 outline-none truncate"
                    />
                    <button
                      onClick={() => handleCopyLink(publishedApp.url)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition shrink-0"
                    >
                      {copiedLink ? (
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
                    <a
                      href={publishedApp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 transition shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ouvrir</span>
                    </a>
                  </div>

                  {/* Sharing Tools Row */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {/* Embed Iframe */}
                    <button
                      onClick={() => handleCopyEmbed(publishedApp.url)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                      title="Copier le code HTML iframe pour intégrer sur votre site"
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{copiedEmbed ? 'Code iframe copié !' : 'Intégrer iframe'}</span>
                    </button>

                    {/* QR Code toggle */}
                    <button
                      onClick={() => setShowQr(!showQr)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{showQr ? 'Masquer QR Code' : 'Afficher QR Code'}</span>
                    </button>

                    {/* Social Share links */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvrez mon application "${publishedApp.title}" créée avec l'IA !`)}&url=${encodeURIComponent(publishedApp.url)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-400" />
                      <span>Partager sur X</span>
                    </a>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Découvrez mon application web "${publishedApp.title}" : ${publishedApp.url}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                    >
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* QR Code display */}
                  {showQr && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-2 animate-in fade-in">
                      <div className="bg-white p-3 rounded-xl shadow-lg">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(publishedApp.url)}`}
                          alt="QR Code"
                          className="w-36 h-36"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 text-center">
                        Scannez ce QR Code avec votre smartphone pour ouvrir l'application mobile en direct !
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Form to publish or update */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Titre de la publication
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: FinTrack Budget Pro"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description (facultative)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Suivi des finances personnelles avec graphiques et persistance locale"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition placeholder:text-slate-600 resize-none"
                  />
                </div>

                {!publishedApp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Identifiant d'URL personnalisée (slug)
                    </label>
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs focus-within:ring-2 focus-within:ring-sky-500/50 focus-within:border-sky-500 transition">
                      <span className="text-slate-500 font-mono select-none">.../p/</span>
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder="mon-application"
                        className="bg-transparent text-sky-300 font-mono flex-1 outline-none ml-1 placeholder:text-slate-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Lien direct généré : <span className="text-slate-400 font-mono">{previewUrl}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                {publishedApp ? (
                  <button
                    onClick={() => handleUnpublish(publishedApp.id)}
                    className="px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Dépublier</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing || !code}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 flex items-center gap-2 transition"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Publication en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{publishedApp ? 'Mettre à jour le lien public' : 'Publier immédiatement'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Tab: All published applications */
            <div className="space-y-3">
              {isLoadingList ? (
                <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Chargement des applications publiées...</span>
                </div>
              ) : allPublished.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Aucune application publiée pour le moment.
                </div>
              ) : (
                allPublished.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-200 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          /p/{item.slug}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.views || 0} vues
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyLink(item.url)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                        title="Copier le lien"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-300 hover:bg-sky-600 hover:text-white transition"
                        title="Ouvrir dans un nouvel onglet"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleUnpublish(item.id)}
                        className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        title="Supprimer / Dépublier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
