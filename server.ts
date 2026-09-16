import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Persistent Storage for Published Apps
const DATA_DIR = path.join(process.cwd(), "data");
const PUBLISHED_FILE = path.join(DATA_DIR, "published_apps.json");

interface PublishedRecord {
  id: string;
  slug: string;
  title: string;
  description?: string;
  code: string;
  publishedAt: number;
  updatedAt: number;
  views: number;
}

function loadPublishedApps(): Map<string, PublishedRecord> {
  const map = new Map<string, PublishedRecord>();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(PUBLISHED_FILE)) {
      const raw = fs.readFileSync(PUBLISHED_FILE, "utf-8");
      const list: PublishedRecord[] = JSON.parse(raw);
      list.forEach((item) => {
        map.set(item.id, item);
        map.set(item.slug, item); // index by both id and slug
      });
    }
  } catch (err) {
    console.error("Failed to read published apps from file:", err);
  }
  return map;
}

function savePublishedApps(map: Map<string, PublishedRecord>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Deduplicate by ID
    const uniqueRecords = Array.from(new Set(Array.from(map.values())).values());
    fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(uniqueRecords, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save published apps to file:", err);
  }
}

const publishedStore = loadPublishedApps();

// Lazy/safe initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

const SYSTEM_INSTRUCTION = `Tu es le moteur d'ingénierie et de design de "R 3D Studio", spécialisé dans la création d'applications web interactives complètes, d'expériences 3D immersives et d'outils modernes immédiatement fonctionnels.
Ton objectif est de générer du code HTML/CSS/JavaScript autonome, complet et prêt à être injecté directement dans un iframe sandbox.

Règles de conception et d'ingénierie :
1. Autonomie totale : Le code doit être un fichier HTML5 complet (avec <!DOCTYPE html>, <head>, <style> si nécessaire, <body>, et <script>).
2. Design moderne et soigné :
   - Inclus TOUJOURS la balise CDN Tailwind CSS : <script src="https://cdn.tailwindcss.com"></script>
   - Inclus la librairie d'icônes Lucide : <script src="https://unpkg.com/lucide@latest"></script> et exécute 'lucide.createIcons();' après chaque modification du DOM.
   - Si une expérience 3D, un modèle ou une visualisation interactive est demandée, inclus Three.js (<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>) ou OrbitControls si nécessaire pour créer des scènes 3D interactives époustouflantes et fluides.
   - Utilise une palette de couleurs professionnelle, des micro-interactions, des transitions fluides, des bordures subtiles et une excellente typographie.
   - Ne fais pas de design cliché ou 'AI slop'. Propose un design haut de gamme avec des contrastes nets, des badges, des boutons bien espacés et un layout fluide.
3. Interactivité et logique réelle :
   - Écris du code JavaScript propre, robuste et sans dépendance externe lourde.
   - Toutes les actions doivent fonctionner : boutons cliquables, formulaires fonctionnels, filtres, recherche instantanée, calculs, compteurs, ajouts/suppressions d'éléments, contrôles 3D interactifs.
   - Pas de fake alert() ou console.log() muet : affiche toujours le feedback directement dans l'interface (toasts, modales, mises à jour en direct).
   - Utilise le LocalStorage pour préserver les données de l'utilisateur quand c'est pertinent.
4. Itération :
   - Si l'utilisateur demande une modification sur du code existant, conserve scrupuleusement les fonctionnalités qui marchaient déjà et intègre harmonieusement la nouvelle fonctionnalité demandée.
5. Format de réponse :
   - Réponds STRICTEMENT au format JSON valide avec la structure suivante :
   {
     "title": "Nom de l'application",
     "description": "Courte description en français",
     "code": "<!DOCTYPE html>... code complet ...</html>",
     "explanation": "Ce qui a été créé ou modifié en français",
     "suggestedImprovements": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
     "tags": ["tag1", "tag2"]
   }`;

// Endpoint for app generation & iteration
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, currentCode, conversationHistory, options } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Le prompt est requis." });
    }

    const ai = getAi();

    let userContent = "";
    if (currentCode && currentCode.trim().length > 0) {
      userContent = `Voici le code actuel de l'application web :
\`\`\`html
${currentCode}
\`\`\`

L'utilisateur demande la modification suivante :
"${prompt}"

${options?.style ? `Style souhaité : ${options.style}` : ""}
${options?.features ? `Fonctionnalités supplémentaires exigées : ${options.features.join(", ")}` : ""}

Génère la version mise à jour complète de l'application web autonome en respectant scrupuleusement la demande et en conservant les acquis.`;
    } else {
      userContent = `Crée une toute nouvelle application web autonome selon cette consigne :
"${prompt}"

${options?.style ? `Style souhaité : ${options.style}` : ""}
${options?.features ? `Fonctionnalités exigées : ${options.features.join(", ")}` : ""}

Assure-toi que l'application soit immédiatement utilisable, interactive, magnifique et complète.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userContent,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text || "";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      // Fallback if model wraps in backticks or markdown
      const cleaned = responseText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    // Ensure code starts with <!DOCTYPE html> or <html>
    if (!parsedData.code && typeof parsedData === "string") {
      parsedData = {
        title: "Application Web",
        description: "Application générée par l'IA",
        code: parsedData,
        explanation: "Application générée avec succès.",
        suggestedImprovements: ["Ajouter le mode sombre", "Ajouter l'exportation", "Améliorer les styles"],
        tags: ["web", "app"],
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    return res.status(500).json({
      error: error.message || "Une erreur est survenue lors de la génération avec l'IA.",
    });
  }
});

// Endpoint to quickly suggest ideas based on a theme or existing code
app.post("/api/suggest", async (req, res) => {
  try {
    const { currentCode, theme } = req.body;
    const ai = getAi();

    const prompt = currentCode
      ? `En analysant ce code d'application web :
\`\`\`html
${currentCode.slice(0, 3000)}
\`\`\`
Donne 4 suggestions concrètes et innovantes d'améliorations ou de fonctionnalités à ajouter en français.`
      : `Donne 5 idées originales d'applications web interactives simples à moyennes que l'on peut générer immédiatement (ex: Outil productivité, Jeu interactif, Visualiseur de données, Simulateur).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `Réponds uniquement avec un objet JSON : { "suggestions": [{ "title": "...", "description": "...", "prompt": "..." }] } en français.`,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Error in /api/suggest:", error);
    return res.status(500).json({
      error: error.message || "Erreur de suggestion",
      suggestions: [
        {
          title: "Tableau Kanban Interactif",
          description: "Gestion de tâches avec colonnes et drag & drop",
          prompt: "Crée un tableau Kanban interactif avec colonnes À faire, En cours, Terminé, drag and drop, étiquettes de priorité et sauvegarde localStorage.",
        },
        {
          title: "Calculateur de Budget Personnel",
          description: "Suivi des dépenses et graphiques visuels",
          prompt: "Crée un tableau de bord de budget personnel avec formulaire de dépenses/revenus, calcul de solde, graphiques par catégorie et filtre par mois.",
        },
        {
          title: "Pomodoro & Studio de Focus",
          description: "Minuteur de travail avec sons d'ambiance",
          prompt: "Crée un minuteur Pomodoro avec cycles travail/pause, sons synthétisés avec Web Audio API, suivi des sessions et citations motivantes.",
        },
      ],
    });
  }
});

// Helper to sanitize slug
function generateSlug(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base || "app"}-${randomSuffix}`;
}

// Helper to get base URL
function getBaseUrl(req: express.Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

// 1. Publish or Update an Application
app.post("/api/publish", (req, res) => {
  try {
    const { id, title, description, code, customSlug } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Le code de l'application est requis pour la publication." });
    }

    const appTitle = (title && typeof title === "string") ? title.trim() : "Application Web";
    const appDesc = (description && typeof description === "string") ? description.trim() : "";

    let record: PublishedRecord;
    const now = Date.now();

    if (id && publishedStore.has(id)) {
      // Update existing
      record = publishedStore.get(id)!;
      record.title = appTitle;
      record.description = appDesc;
      record.code = code;
      record.updatedAt = now;
    } else {
      // New publication
      const newId = "pub_" + Math.random().toString(36).substring(2, 11);
      let slug = customSlug ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/(^-|-$)/g, "") : "";
      if (!slug || publishedStore.has(slug)) {
        slug = generateSlug(appTitle);
      }

      record = {
        id: newId,
        slug,
        title: appTitle,
        description: appDesc,
        code,
        publishedAt: now,
        updatedAt: now,
        views: 0,
      };
    }

    publishedStore.set(record.id, record);
    publishedStore.set(record.slug, record);
    savePublishedApps(publishedStore);

    const baseUrl = getBaseUrl(req);
    const publicUrl = `${baseUrl}/p/${record.slug}`;

    return res.json({
      success: true,
      publishedApp: {
        id: record.id,
        slug: record.slug,
        title: record.title,
        description: record.description,
        publishedAt: record.publishedAt,
        updatedAt: record.updatedAt,
        views: record.views,
        url: publicUrl,
        code: record.code,
      },
    });
  } catch (err: any) {
    console.error("Error in /api/publish:", err);
    return res.status(500).json({ error: err.message || "Erreur lors de la publication" });
  }
});

// 2. List all published applications
app.get("/api/published", (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const unique = Array.from(new Set(Array.from(publishedStore.values())).values());
    const sorted = unique.sort((a, b) => b.updatedAt - a.updatedAt);

    const list = sorted.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      views: item.views,
      url: `${baseUrl}/p/${item.slug}`,
    }));

    return res.json({ apps: list });
  } catch (err: any) {
    console.error("Error in GET /api/published:", err);
    return res.status(500).json({ error: "Impossible de récupérer les applications publiées" });
  }
});

// 3. Get a single published app by id or slug
app.get("/api/publish/:id", (req, res) => {
  try {
    const { id } = req.params;
    const record = publishedStore.get(id);
    if (!record) {
      return res.status(404).json({ error: "Application introuvable" });
    }
    const baseUrl = getBaseUrl(req);
    return res.json({
      app: {
        id: record.id,
        slug: record.slug,
        title: record.title,
        description: record.description,
        code: record.code,
        publishedAt: record.publishedAt,
        updatedAt: record.updatedAt,
        views: record.views,
        url: `${baseUrl}/p/${record.slug}`,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur lors du chargement" });
  }
});

// 4. Delete a published app
app.delete("/api/publish/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!publishedStore.has(id)) {
      return res.status(404).json({ error: "Application introuvable" });
    }
    const record = publishedStore.get(id)!;
    publishedStore.delete(record.id);
    publishedStore.delete(record.slug);
    savePublishedApps(publishedStore);
    return res.json({ success: true, message: "Application dépubliée avec succès." });
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// 4. Standalone Public View Route: /p/:slug (Direct live web application)
app.get("/p/:slug", (req, res) => {
  const { slug } = req.params;
  const record = publishedStore.get(slug);

  if (!record) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application introuvable - R 3D Studio</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div class="text-center max-w-md space-y-4">
          <div class="text-5xl font-extrabold text-sky-400">404</div>
          <h1 class="text-xl font-bold">Application introuvable</h1>
          <p class="text-xs text-slate-400">Cette application n'existe pas ou a été retirée par son créateur.</p>
          <a href="/" class="inline-block px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition">
            Ouvrir R 3D Studio
          </a>
        </div>
      </body>
      </html>
    `);
  }

  // Increment view counter
  record.views = (record.views || 0) + 1;
  savePublishedApps(publishedStore);

  const isEmbed = req.query.embed === "true";
  let html = record.code;

  // Add a discreet floating branding badge if not embedded
  if (!isEmbed) {
    const badge = `
    <!-- R 3D Studio Floating Badge -->
    <div id="webcraft-badge" style="position:fixed;bottom:14px;right:14px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;background:rgba(15,23,42,0.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);padding:6px 12px;border-radius:9999px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,0.4);color:#e2e8f0;transition:all 0.2s ease;">
      <span style="display:flex;align-items:center;gap:4px;">
        <span style="color:#38bdf8;">✨</span> Propulsé par <strong>R 3D Studio</strong>
      </span>
      <span style="width:1px;height:12px;background:rgba(255,255,255,0.2);"></span>
      <a href="/?import_pub=${record.id}" target="_blank" style="color:#38bdf8;text-decoration:none;font-weight:600;font-size:11px;">Ouvrir dans le Studio</a>
      <button onclick="document.getElementById('webcraft-badge').style.display='none'" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0 0 0 4px;font-size:12px;line-height:1;" title="Masquer">×</button>
    </div>
    `;

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${badge}</body>`);
    } else {
      html += badge;
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(html);
});

async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
