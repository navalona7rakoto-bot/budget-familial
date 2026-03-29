# 💰 Budget Familial

Application web progressive (PWA) de gestion des finances familiales, conçue pour Madagascar et l'Afrique francophone.

**✨ Fonctionnalités principales :**
- 📊 Suivi des revenus et dépenses en temps réel
- 💸 Catégories prédéfinies (JIRAMA, Courses, Transport, etc.)
- 📱 Interface mobile-first responsive
- 🔐 Authentification sécurisée
- 💾 Base de données cloud (Supabase)
- 🌐 Déployable sur GitHub Pages gratuitement

---

## 🚀 DÉPLOIEMENT EN 3 ÉTAPES (30 minutes)

### ÉTAPE 1 : Configuration Supabase (10 minutes)

1. **Créer un compte Supabase**
   - Va sur [https://supabase.com](https://supabase.com)
   - Clique sur "Start your project"
   - Crée un compte gratuit (email + mot de passe)

2. **Créer un nouveau projet**
   - Clique sur "New Project"
   - Nom du projet : `budget-familial`
   - Mot de passe de la base de données : choisis un mot de passe fort
   - Région : `Southeast Asia (Singapore)` (plus proche de Madagascar)
   - Clique sur "Create new project"
   - ⏱️ Attends 2-3 minutes que le projet soit créé

3. **Créer la base de données**
   - Dans le menu à gauche, clique sur "SQL Editor"
   - Clique sur "New query"
   - Copie tout le contenu du fichier `database.sql`
   - Colle dans l'éditeur SQL
   - Clique sur "Run" (ou Ctrl+Enter)
   - ✅ Tu devrais voir "Success. No rows returned"

4. **Récupérer les clés API**
   - Dans le menu à gauche, clique sur "Settings" (⚙️)
   - Clique sur "API"
   - Note ces 2 informations importantes :
     * **Project URL** (ressemble à : `https://xxxxx.supabase.co`)
     * **anon public** key (commence par `eyJ...`)

---

### ÉTAPE 2 : Configuration du code (5 minutes)

1. **Créer un fichier .env**
   - Dans le dossier du projet, crée un fichier `.env`
   - Ajoute ces lignes (remplace par tes vraies valeurs) :
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx
   ```

2. **Modifier vite.config.js**
   - Ouvre le fichier `vite.config.js`
   - Remplace `/budget-familial/` par le nom de ton repo GitHub
   - Exemple : si ton repo s'appelle `family-budget`, mets `/family-budget/`

---

### ÉTAPE 3 : Déploiement GitHub Pages (15 minutes)

1. **Créer un repo GitHub**
   - Va sur [https://github.com/new](https://github.com/new)
   - Nom du repository : `budget-familial` (ou autre nom)
   - Choisis "Public"
   - Ne coche RIEN d'autre
   - Clique sur "Create repository"

2. **Pousser le code sur GitHub**
   - Ouvre un terminal dans le dossier du projet
   - Exécute ces commandes une par une :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Budget Familial"
   git branch -M main
   git remote add origin https://github.com/TON_USERNAME/budget-familial.git
   git push -u origin main
   ```

3. **Installer les dépendances et déployer**
   ```bash
   npm install
   npm run deploy
   ```

4. **Activer GitHub Pages**
   - Va sur ton repo GitHub
   - Clique sur "Settings"
   - Dans le menu à gauche, clique sur "Pages"
   - Source : sélectionne "gh-pages" branch
   - Clique sur "Save"
   - ✅ Ton app sera disponible à : `https://TON_USERNAME.github.io/budget-familial/`

---

## 🎯 TEST LOCAL (avant déploiement)

Pour tester l'application sur ton ordinateur :

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvre ton navigateur à : `http://localhost:5173`

---

## 📂 STRUCTURE DU PROJET

```
budget-familial/
├── src/
│   ├── components/          # Composants React
│   │   ├── Auth.jsx         # Connexion/Inscription
│   │   ├── Dashboard.jsx    # Écran principal
│   │   ├── AddTransaction.jsx
│   │   ├── Categories.jsx
│   │   ├── History.jsx
│   │   ├── Profile.jsx
│   │   └── Navigation.jsx
│   ├── lib/
│   │   └── supabase.js      # Config Supabase
│   ├── App.jsx              # App principale
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles
├── public/
│   └── manifest.json        # Config PWA
├── database.sql             # Script SQL
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 CATÉGORIES DISPONIBLES

### Revenus 💰
- Salaire
- Freelance / Travail indépendant
- Investissements / Loyers perçus
- Allocations / Aides sociales
- Autres revenus

### Dépenses 💸
- Loyer / Crédit immobilier
- JIRAMA (eau + électricité)
- Courses alimentaires
- Transport (essence, taxi, bus)
- Santé (médecin, pharmacie, mutuelle)
- Éducation (école, fournitures)
- Loisirs / Sorties
- Épargne
- Vêtements
- Téléphone / Internet
- Assurances
- Autres dépenses

---

## 🔧 COMMANDES UTILES

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Déployer sur GitHub Pages
npm run deploy
```

---

## 🐛 PROBLÈMES COURANTS

### Erreur "Supabase URL not found"
→ Vérifie que le fichier `.env` existe et contient les bonnes clés

### Erreur 404 après déploiement
→ Vérifie que la `base` dans `vite.config.js` correspond au nom de ton repo

### Les transactions n'apparaissent pas
→ Vérifie dans Supabase que les policies RLS sont bien créées

### L'app ne se charge pas
→ Ouvre la console du navigateur (F12) pour voir les erreurs

---

## 📱 INSTALLER COMME APP MOBILE

L'application est une PWA, elle peut être installée sur smartphone :

**Android (Chrome) :**
1. Ouvre l'app dans Chrome
2. Menu ⋮ → "Installer l'application"
3. L'icône apparaîtra sur l'écran d'accueil

**iOS (Safari) :**
1. Ouvre l'app dans Safari
2. Partager 📤 → "Sur l'écran d'accueil"
3. L'icône apparaîtra sur l'écran d'accueil

---

## 🔐 SÉCURITÉ

- ✅ Authentification sécurisée (Supabase Auth)
- ✅ Row Level Security (RLS) activée
- ✅ Chaque utilisateur voit uniquement ses propres données
- ✅ Connexion HTTPS obligatoire
- ✅ Clés API protégées côté serveur

---

## 📊 COÛTS

**100% GRATUIT jusqu'à :**
- 50 000 utilisateurs actifs mensuels (Supabase)
- 500 Mo de base de données (Supabase)
- 1 Go de stockage (Supabase)
- Hébergement illimité (GitHub Pages)

→ Parfait pour tester et lancer le MVP ! 🚀

---

## 🆘 SUPPORT

Des questions ? Contacte-moi ou ouvre une issue sur GitHub.

**Made with ❤️ pour Madagascar et l'Afrique francophone**
