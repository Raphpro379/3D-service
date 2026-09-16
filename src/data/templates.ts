export interface TemplatePreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  prompt: string;
  initialCode: string;
}

export const TEMPLATES: TemplatePreset[] = [
  {
    id: "fintrack-budget",
    title: "FinTrack - Gestionnaire de Budget",
    description: "Application financière avec solde en direct, répartition des dépenses et historique.",
    icon: "Wallet",
    category: "Finance & Productivité",
    prompt: "Crée une application de suivi budgétaire moderne avec solde en temps réel, ajout de revenus et dépenses par catégorie, filtrage et historique interactif.",
    initialCode: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinTrack - Budget Personnel</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 md:p-8">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-slate-800 pb-5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
          <i data-lucide="wallet" class="w-5 h-5"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight">FinTrack Budget</h1>
          <p class="text-xs text-slate-400">Gérez vos finances avec clarté</p>
        </div>
      </div>
      <button onclick="resetData()" class="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Réinitialiser
      </button>
    </header>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
          <span>SOLDE TOTAL</span>
          <i data-lucide="piggy-bank" class="w-4 h-4 text-emerald-400"></i>
        </div>
        <div id="totalBalance" class="text-2xl font-extrabold text-emerald-400">0,00 €</div>
        <div class="text-[11px] text-slate-400 mt-1">Solde net disponible</div>
      </div>

      <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
          <span>REVENUS DU MOIS</span>
          <i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i>
        </div>
        <div id="totalIncome" class="text-2xl font-extrabold text-slate-100">+0,00 €</div>
        <div class="text-[11px] text-emerald-400/80 mt-1">Entrées financières</div>
      </div>

      <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
          <span>DÉPENSES DU MOIS</span>
          <i data-lucide="trending-down" class="w-4 h-4 text-rose-400"></i>
        </div>
        <div id="totalExpense" class="text-2xl font-extrabold text-slate-100">-0,00 €</div>
        <div class="text-[11px] text-rose-400/80 mt-1">Sorties financières</div>
      </div>
    </div>

    <!-- Main Grid: Form + List -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulaire -->
      <div class="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-400"></i> Nouvelle opération
        </h2>
        <form id="txForm" onsubmit="addTransaction(event)" class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Description</label>
            <input type="text" id="descInput" required placeholder="Ex: Salaire, Courses, Netflix..." class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Montant (€)</label>
            <input type="number" step="0.01" id="amountInput" required placeholder="0.00" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Type</label>
              <select id="typeInput" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500">
                <option value="expense">Dépense (-)</option>
                <option value="income">Revenu (+)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Catégorie</label>
              <select id="categoryInput" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500">
                <option value="Alimentation">Alimentation</option>
                <option value="Logement">Logement</option>
                <option value="Loisirs">Loisirs</option>
                <option value="Transport">Transport</option>
                <option value="Salaire">Salaire</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
            <i data-lucide="check" class="w-4 h-4"></i> Ajouter l'opération
          </button>
        </form>
      </div>

      <!-- Transactions List -->
      <div class="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <i data-lucide="list" class="w-4 h-4 text-emerald-400"></i> Historique
          </h2>
          <div class="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800 text-xs">
            <button onclick="setFilter('all')" id="filter-all" class="px-2.5 py-1 rounded bg-slate-700 text-white font-medium">Tous</button>
            <button onclick="setFilter('income')" id="filter-income" class="px-2.5 py-1 rounded text-slate-400 hover:text-white">Revenus</button>
            <button onclick="setFilter('expense')" id="filter-expense" class="px-2.5 py-1 rounded text-slate-400 hover:text-white">Dépenses</button>
          </div>
        </div>

        <div id="transactionsContainer" class="space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
          <!-- Injecté par JS -->
        </div>
      </div>
    </div>
  </div>

  <script>
    let transactions = JSON.parse(localStorage.getItem('fintrack_txs') || '[]');
    let currentFilter = 'all';

    if (transactions.length === 0) {
      transactions = [
        { id: 1, desc: 'Salaire mensuel', amount: 2600, type: 'income', category: 'Salaire', date: new Date().toLocaleDateString('fr-FR') },
        { id: 2, desc: 'Loyer appartement', amount: 850, type: 'expense', category: 'Logement', date: new Date().toLocaleDateString('fr-FR') },
        { id: 3, desc: 'Courses supermarché', amount: 142.50, type: 'expense', category: 'Alimentation', date: new Date().toLocaleDateString('fr-FR') },
        { id: 4, desc: 'Abonnement musique & streaming', amount: 24.99, type: 'expense', category: 'Loisirs', date: new Date().toLocaleDateString('fr-FR') }
      ];
      save();
    }

    function save() {
      localStorage.setItem('fintrack_txs', JSON.stringify(transactions));
      render();
    }

    function addTransaction(e) {
      e.preventDefault();
      const desc = document.getElementById('descInput').value.trim();
      const amount = parseFloat(document.getElementById('amountInput').value);
      const type = document.getElementById('typeInput').value;
      const category = document.getElementById('categoryInput').value;

      if (!desc || isNaN(amount) || amount <= 0) return;

      transactions.unshift({
        id: Date.now(),
        desc,
        amount,
        type,
        category,
        date: new Date().toLocaleDateString('fr-FR')
      });

      save();
      document.getElementById('txForm').reset();
    }

    function deleteTx(id) {
      transactions = transactions.filter(t => t.id !== id);
      save();
    }

    function resetData() {
      if (confirm('Voulez-vous réinitialiser toutes les opérations ?')) {
        transactions = [];
        save();
      }
    }

    function setFilter(f) {
      currentFilter = f;
      ['all', 'income', 'expense'].forEach(k => {
        const btn = document.getElementById('filter-' + k);
        if (k === f) {
          btn.className = 'px-2.5 py-1 rounded bg-slate-700 text-white font-medium';
        } else {
          btn.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white';
        }
      });
      render();
    }

    function render() {
      const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const balance = income - expense;

      document.getElementById('totalBalance').innerText = balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      document.getElementById('totalIncome').innerText = '+' + income.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      document.getElementById('totalExpense').innerText = '-' + expense.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

      const filtered = transactions.filter(t => currentFilter === 'all' ? true : t.type === currentFilter);
      const container = document.getElementById('transactionsContainer');

      if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-slate-500 text-sm">Aucune opération trouvée.</div>';
      } else {
        container.innerHTML = filtered.map(t => {
          const isIncome = t.type === 'income';
          return \`
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg \${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} flex items-center justify-center">
                  <i data-lucide="\${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4"></i>
                </div>
                <div>
                  <div class="font-medium text-sm text-slate-200">\${t.desc}</div>
                  <div class="text-xs text-slate-500">\${t.category} • \${t.date}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-bold text-sm \${isIncome ? 'text-emerald-400' : 'text-rose-400'}">
                  \${isIncome ? '+' : '-'}\${t.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
                <button onclick="deleteTx(\${t.id})" class="text-slate-500 hover:text-rose-400 p-1 rounded transition">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          \`;
        }).join('');
      }

      if (window.lucide) lucide.createIcons();
    }

    render();
  </script>
</body>
</html>`
  },
  {
    id: "kanban-taskboard",
    title: "KanbanFlow - Gestionnaire de Projets",
    description: "Tableau agile avec colonnes, déplacement de cartes, priorités et ajout instantané.",
    icon: "LayoutList",
    category: "Productivité",
    prompt: "Crée une application de tableau Kanban interactive avec colonnes À faire, En cours et Terminé, ajout rapide de cartes avec priorités, compteurs de tâches et sauvegarde automatique.",
    initialCode: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KanbanFlow - Tableau Agile</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 flex flex-col">
  <header class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
        <i data-lucide="trello" class="w-5 h-5"></i>
      </div>
      <div>
        <h1 class="text-xl font-bold">KanbanFlow Studio</h1>
        <p class="text-xs text-slate-400">Gérez vos sprints et priorités</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="openModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/20">
        <i data-lucide="plus" class="w-4 h-4"></i> Nouvelle tâche
      </button>
    </div>
  </header>

  <!-- Kanban Board -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
    <!-- Col: Todo -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <h2 class="font-bold text-sm text-slate-200">À faire</h2>
          <span id="count-todo" class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">0</span>
        </div>
      </div>
      <div id="col-todo" class="space-y-3 flex-1 overflow-y-auto"></div>
    </div>

    <!-- Col: Doing -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          <h2 class="font-bold text-sm text-slate-200">En cours</h2>
          <span id="count-doing" class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">0</span>
        </div>
      </div>
      <div id="col-doing" class="space-y-3 flex-1 overflow-y-auto"></div>
    </div>

    <!-- Col: Done -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h2 class="font-bold text-sm text-slate-200">Terminé</h2>
          <span id="count-done" class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">0</span>
        </div>
      </div>
      <div id="col-done" class="space-y-3 flex-1 overflow-y-auto"></div>
    </div>
  </div>

  <!-- Modal Nouvelle Tâche -->
  <div id="taskModal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="font-bold text-slate-100">Créer une tâche</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-200"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form onsubmit="handleCreateTask(event)" class="space-y-3">
        <div>
          <label class="block text-xs text-slate-400 mb-1">Titre de la tâche</label>
          <input id="taskTitle" required placeholder="Ex: Intégrer la passerelle Stripe..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500">
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Priorité</label>
          <select id="taskPriority" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500">
            <option value="high">Haute 🔴</option>
            <option value="medium" selected>Moyenne 🟡</option>
            <option value="low">Basse 🟢</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800">Annuler</button>
          <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold">Ajouter</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('kanban_tasks') || '[]');

    if (tasks.length === 0) {
      tasks = [
        { id: 1, title: 'Concevoir la maquette UI responsive', status: 'done', priority: 'high' },
        { id: 2, title: 'Connecter les API avec Gemini 3 Flash', status: 'doing', priority: 'high' },
        { id: 3, title: 'Ajouter les tests fonctionnels et linter', status: 'todo', priority: 'medium' },
        { id: 4, title: 'Préparer la documentation utilisateur', status: 'todo', priority: 'low' }
      ];
      save();
    }

    function save() {
      localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
      render();
    }

    function moveTask(id, nextStatus) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.status = nextStatus;
        save();
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      save();
    }

    function openModal() {
      document.getElementById('taskModal').classList.remove('hidden');
      document.getElementById('taskTitle').focus();
    }
    function closeModal() {
      document.getElementById('taskModal').classList.add('hidden');
    }

    function handleCreateTask(e) {
      e.preventDefault();
      const title = document.getElementById('taskTitle').value.trim();
      const priority = document.getElementById('taskPriority').value;
      if (!title) return;

      tasks.push({
        id: Date.now(),
        title,
        status: 'todo',
        priority
      });

      closeModal();
      document.getElementById('taskTitle').value = '';
      save();
    }

    function render() {
      ['todo', 'doing', 'done'].forEach(col => {
        const colTasks = tasks.filter(t => t.status === col);
        document.getElementById('count-' + col).innerText = colTasks.length;
        const container = document.getElementById('col-' + col);

        if (colTasks.length === 0) {
          container.innerHTML = '<div class="h-24 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-600">Aucune tâche</div>';
          return;
        }

        container.innerHTML = colTasks.map(t => {
          const priorityBadge = t.priority === 'high' 
            ? '<span class="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-medium border border-rose-500/30">Urgent</span>'
            : t.priority === 'medium'
            ? '<span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium border border-amber-500/30">Moyen</span>'
            : '<span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium border border-emerald-500/30">Normal</span>';

          return \`
            <div class="bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl shadow-sm space-y-3 transition">
              <div class="flex items-start justify-between gap-2">
                <span class="text-sm font-medium text-slate-200 leading-snug">\${t.title}</span>
                <button onclick="deleteTask(\${t.id})" class="text-slate-600 hover:text-rose-400 transition p-1">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-slate-800/80">
                \${priorityBadge}
                <div class="flex items-center gap-1">
                  \${col !== 'todo' ? \`<button onclick="moveTask(\${t.id}, '\${col === 'done' ? 'doing' : 'todo'}')" class="text-xs text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>\` : ''}
                  \${col !== 'done' ? \`<button onclick="moveTask(\${t.id}, '\${col === 'todo' ? 'doing' : 'done'}')" class="text-xs text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>\` : ''}
                </div>
              </div>
            </div>
          \`;
        }).join('');
      });

      if (window.lucide) lucide.createIcons();
    }

    render();
  </script>
</body>
</html>`
  },
  {
    id: "pomodoro-studio",
    title: "FocusFlow - Minuteur Pomodoro",
    description: "Chronomètre d'intervalles avec sons synthétisés, historique des sessions et mode plein écran.",
    icon: "Clock",
    category: "Productivité & Bien-être",
    prompt: "Crée un minuteur Pomodoro moderne avec sélection des modes (25min travail, 5min courte pause, 15min longue pause), barre de progression circulaire, sons Web Audio et liste de tâches d'accompagnement.",
    initialCode: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FocusFlow - Studio Pomodoro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-stone-950 text-stone-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
          <i data-lucide="flame" class="w-4 h-4"></i>
        </div>
        <span class="font-bold text-sm tracking-wide text-stone-200">FocusFlow</span>
      </div>
      <div class="text-xs text-stone-400 flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-full border border-stone-700/50">
        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-orange-400"></i>
        <span id="cycleCount">Session 1 / 4</span>
      </div>
    </div>

    <!-- Mode Selector -->
    <div class="grid grid-cols-3 gap-1.5 bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 text-xs font-semibold">
      <button onclick="setMode('work')" id="btn-work" class="py-2 rounded-xl bg-orange-500 text-stone-950 font-bold shadow transition">Focus</button>
      <button onclick="setMode('short')" id="btn-short" class="py-2 rounded-xl text-stone-400 hover:text-stone-200 transition">Pause</button>
      <button onclick="setMode('long')" id="btn-long" class="py-2 rounded-xl text-stone-400 hover:text-stone-200 transition">Longue</button>
    </div>

    <!-- Central Timer Display -->
    <div class="relative flex flex-col items-center justify-center py-6">
      <div class="text-6xl sm:text-7xl font-extrabold tracking-tighter text-stone-100 tabular-nums" id="timerDisplay">
        25:00
      </div>
      <p id="modeDesc" class="text-xs text-stone-400 font-medium mt-2">Restez concentré sur votre tâche</p>
    </div>

    <!-- Control Buttons -->
    <div class="flex items-center justify-center gap-4">
      <button onclick="toggleTimer()" id="playBtn" class="bg-orange-500 hover:bg-orange-400 text-stone-950 font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2.5 text-sm transition shadow-lg shadow-orange-500/20 active:scale-95">
        <i data-lucide="play" class="w-5 h-5 fill-current"></i> Démarrer
      </button>
      <button onclick="resetTimer()" class="p-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition border border-stone-700 active:scale-95">
        <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Quick Mini-Task -->
    <div class="pt-4 border-t border-stone-800/80 space-y-2">
      <div class="flex items-center justify-between text-xs text-stone-400">
        <span>Objectif de la session</span>
      </div>
      <input id="currentGoal" placeholder="Ex: Rédaction du rapport, Debug, Lecture..." class="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-orange-500">
    </div>
  </div>

  <script>
    let timeLeft = 25 * 60;
    let totalTime = 25 * 60;
    let timerId = null;
    let currentMode = 'work';
    let completedSessions = 0;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playTone(freq, type, duration) {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function setMode(mode) {
      clearInterval(timerId);
      timerId = null;
      currentMode = mode;
      document.getElementById('playBtn').innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> Démarrer';

      ['work', 'short', 'long'].forEach(m => {
        const btn = document.getElementById('btn-' + m);
        if (m === mode) {
          btn.className = 'py-2 rounded-xl bg-orange-500 text-stone-950 font-bold shadow transition';
        } else {
          btn.className = 'py-2 rounded-xl text-stone-400 hover:text-stone-200 transition';
        }
      });

      if (mode === 'work') {
        totalTime = 25 * 60;
        document.getElementById('modeDesc').innerText = 'Restez concentré sur votre tâche';
      } else if (mode === 'short') {
        totalTime = 5 * 60;
        document.getElementById('modeDesc').innerText = 'Prenez une courte pause de 5 min';
      } else {
        totalTime = 15 * 60;
        document.getElementById('modeDesc').innerText = 'Prenez une longue pause méritée';
      }

      timeLeft = totalTime;
      updateDisplay();
      if (window.lucide) lucide.createIcons();
    }

    function toggleTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('playBtn').innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> Reprendre';
      } else {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        playTone(600, 'sine', 0.15);
        document.getElementById('playBtn').innerHTML = '<i data-lucide="pause" class="w-5 h-5 fill-current"></i> Pause';
        timerId = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(timerId);
            timerId = null;
            onComplete();
          }
        }, 1000);
      }
      if (window.lucide) lucide.createIcons();
    }

    function resetTimer() {
      clearInterval(timerId);
      timerId = null;
      timeLeft = totalTime;
      document.getElementById('playBtn').innerHTML = '<i data-lucide="play" class="w-5 h-5 fill-current"></i> Démarrer';
      updateDisplay();
      if (window.lucide) lucide.createIcons();
    }

    function onComplete() {
      playTone(523.25, 'triangle', 0.3);
      setTimeout(() => playTone(659.25, 'triangle', 0.5), 200);
      if (currentMode === 'work') {
        completedSessions++;
        document.getElementById('cycleCount').innerText = 'Session ' + (completedSessions % 4 + 1) + ' / 4';
        setMode(completedSessions % 4 === 0 ? 'long' : 'short');
      } else {
        setMode('work');
      }
    }

    function updateDisplay() {
      const min = Math.floor(timeLeft / 60);
      const sec = timeLeft % 60;
      document.getElementById('timerDisplay').innerText = 
        String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }

    updateDisplay();
    if (window.lucide) lucide.createIcons();
  </script>
</body>
</html>`
  },
  {
    id: "r3d-studio-viewport",
    title: "R 3D Studio - Visualiseur 3D Interactif",
    description: "Expérience 3D interactive avec Three.js, rotation à la souris, sélecteur de formes et effets lumineux.",
    icon: "Box",
    category: "3D & Expériences Immersives",
    prompt: "Crée une scène 3D interactive avec Three.js : navigation orbitale à la souris, sélecteur de formes 3D (Torus Knot, Sphère géodésique, Cube néon), contrôle de la vitesse de rotation, du mode fil de fer et champ d'étoiles dynamique.",
    initialCode: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>R 3D Studio - Visualiseur 3D</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow: hidden; }
    canvas { display: block; outline: none; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen relative select-none">
  <!-- 3D Canvas Container -->
  <div id="canvas-container" class="absolute inset-0 cursor-grab active:cursor-grabbing"></div>

  <!-- Top Overlay Bar -->
  <div class="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
    <div class="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 p-0.5 flex items-center justify-center">
        <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
          <i data-lucide="box" class="w-4 h-4 text-sky-400"></i>
        </div>
      </div>
      <div>
        <h1 class="text-xs font-bold text-slate-100 tracking-tight flex items-center gap-1">
          <span>R 3D Studio</span>
          <span class="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1 rounded">WebGL</span>
        </h1>
        <p class="text-[10px] text-slate-400">Glissez avec la souris pour faire pivoter</p>
      </div>
    </div>

    <!-- Live Stats -->
    <div class="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 pointer-events-auto flex items-center gap-3 shadow-xl">
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        60 FPS
      </span>
      <span class="text-slate-600">|</span>
      <span id="polyCount">3,840 triangles</span>
    </div>
  </div>

  <!-- Bottom Floating Controls Deck -->
  <div class="absolute bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-xl bg-slate-900/85 backdrop-blur-lg border border-slate-800/90 p-4 rounded-3xl shadow-2xl space-y-3">
    <!-- Shape Selector -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80">
        <button onclick="setShape('torus')" id="btn-torus" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-500 text-white shadow-sm transition">
          Torus Knot
        </button>
        <button onclick="setShape('sphere')" id="btn-sphere" class="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition">
          Icosaèdre
        </button>
        <button onclick="setShape('cube')" id="btn-cube" class="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition">
          Hypercube
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="toggleWireframe()" id="btn-wireframe" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition flex items-center gap-1.5">
          <i data-lucide="layers" class="w-3.5 h-3.5 text-indigo-400"></i>
          <span>Fil de fer</span>
        </button>
        <button onclick="toggleAutoRotate()" id="btn-autorotate" class="px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30 transition flex items-center gap-1.5">
          <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
          <span>Rotation</span>
        </button>
      </div>
    </div>

    <!-- Sliders row -->
    <div class="grid grid-cols-2 gap-4 pt-1 text-xs">
      <div>
        <div class="flex justify-between text-slate-400 mb-1 text-[11px]">
          <span>Vitesse de rotation</span>
          <span id="speedVal" class="font-mono text-sky-400">1.0x</span>
        </div>
        <input type="range" min="0" max="3" step="0.1" value="1" id="speedSlider" oninput="updateSpeed(this.value)" class="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer">
      </div>
      <div>
        <div class="flex justify-between text-slate-400 mb-1 text-[11px]">
          <span>Éclairage dynamique</span>
          <span id="lightVal" class="font-mono text-indigo-400">Néon Cyan</span>
        </div>
        <div class="flex items-center gap-2 pt-0.5">
          <button onclick="setTheme('#38bdf8', 'Néon Cyan')" class="w-5 h-5 rounded-full bg-sky-400 ring-2 ring-sky-400/40 transition hover:scale-110"></button>
          <button onclick="setTheme('#a855f7', 'Violet Cyber')" class="w-5 h-5 rounded-full bg-purple-500 transition hover:scale-110"></button>
          <button onclick="setTheme('#10b981', 'Émeraude Matrix')" class="w-5 h-5 rounded-full bg-emerald-500 transition hover:scale-110"></button>
          <button onclick="setTheme('#f43f5e', 'Rose Fluo')" class="w-5 h-5 rounded-full bg-rose-500 transition hover:scale-110"></button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Initialize Three.js Scene
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.025);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 30;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ size: 0.05, color: 0x94a3b8, transparent: true, opacity: 0.7 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x6366f1, 1.5, 50);
    backLight.position.set(-5, -5, -4);
    scene.add(backLight);

    // Main 3D Mesh
    let currentMesh = null;
    let isWireframe = false;
    let autoRotate = true;
    let rotationSpeed = 1.0;
    let currentColor = 0x38bdf8;

    function createGeometry(type) {
      if (type === 'torus') {
        document.getElementById('polyCount').innerText = '4,600 triangles';
        return new THREE.TorusKnotGeometry(1.4, 0.45, 128, 24);
      } else if (type === 'sphere') {
        document.getElementById('polyCount').innerText = '2,560 triangles';
        return new THREE.IcosahedronGeometry(2.0, 3);
      } else {
        document.getElementById('polyCount').innerText = '1,200 triangles';
        return new THREE.BoxGeometry(2.2, 2.2, 2.2, 6, 6, 6);
      }
    }

    function setShape(type) {
      ['torus', 'sphere', 'cube'].forEach(id => {
        const btn = document.getElementById('btn-' + id);
        if (id === type) {
          btn.className = 'px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-500 text-white shadow-sm transition';
        } else {
          btn.className = 'px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition';
        }
      });

      if (currentMesh) scene.remove(currentMesh);

      const geo = createGeometry(type);
      const mat = new THREE.MeshStandardMaterial({
        color: currentColor,
        roughness: 0.25,
        metalness: 0.8,
        wireframe: isWireframe
      });

      currentMesh = new THREE.Mesh(geo, mat);
      scene.add(currentMesh);
    }

    setShape('torus');

    function toggleWireframe() {
      isWireframe = !isWireframe;
      if (currentMesh) currentMesh.material.wireframe = isWireframe;
      const btn = document.getElementById('btn-wireframe');
      btn.className = isWireframe 
        ? 'px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 text-white border border-indigo-500 transition flex items-center gap-1.5'
        : 'px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition flex items-center gap-1.5';
    }

    function toggleAutoRotate() {
      autoRotate = !autoRotate;
      const btn = document.getElementById('btn-autorotate');
      btn.className = autoRotate 
        ? 'px-3 py-1.5 rounded-xl text-xs font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30 transition flex items-center gap-1.5'
        : 'px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 transition flex items-center gap-1.5';
    }

    function updateSpeed(val) {
      rotationSpeed = parseFloat(val);
      document.getElementById('speedVal').innerText = rotationSpeed.toFixed(1) + 'x';
    }

    function setTheme(hexColor, name) {
      currentColor = new THREE.Color(hexColor);
      if (currentMesh) currentMesh.material.color.set(currentColor);
      pointLight.color.set(currentColor);
      document.getElementById('lightVal').innerText = name;
    }

    // Interactive Drag Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#canvas-container')) {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !currentMesh) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      currentMesh.rotation.y += deltaX * 0.01;
      currentMesh.rotation.x += deltaY * 0.01;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !currentMesh || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      currentMesh.rotation.y += deltaX * 0.01;
      currentMesh.rotation.x += deltaY * 0.01;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    // Handle Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Render Loop
    function animate() {
      requestAnimationFrame(animate);

      if (currentMesh && autoRotate) {
        currentMesh.rotation.x += 0.005 * rotationSpeed;
        currentMesh.rotation.y += 0.009 * rotationSpeed;
      }
      starField.rotation.y -= 0.0005;

      renderer.render(scene, camera);
    }
    animate();

    if (window.lucide) lucide.createIcons();
  </script>
</body>
</html>`
  }
];
