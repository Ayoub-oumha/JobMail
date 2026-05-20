# 📧 JobMailer — Automatiseur d'Emails de Candidature

> **Envoie des emails de candidature professionnels et personnalisés par IA, en quelques clics.**

[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%2FLocal-green?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)](https://docker.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange?logo=openai)](https://openai.com)

---

## 📋 Table des Matières

- [🎯 Présentation](#-présentation)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🔧 Technologies Utilisées](#-technologies-utilisées)
- [📁 Structure du Projet](#-structure-du-projet)
- [🚀 Guide d'Installation](#-guide-dinstallation)
- [⚙️ Configuration](#️-configuration)
- [▶️ Lancer le Projet](#️-lancer-le-projet)
- [📖 Guide d'Utilisation](#-guide-dutilisation)
- [🐳 Déploiement Docker](#-déploiement-docker)
- [🔌 API Reference](#-api-reference)
- [🗄️ Base de Données](#️-base-de-données)
- [❓ FAQ & Dépannage](#-faq--dépannage)

---

## 🎯 Présentation

**JobMailer** est une application web full-stack qui **automatise l'envoi d'emails de candidature**. Elle utilise l'**IA (GPT-3.5-turbo)** pour générer des lettres de motivation personnalisées en français, puis les envoie directement aux recruteurs avec ton CV en pièce jointe.

### 💡 Pourquoi JobMailer ?

Postuler à des dizaines d'offres d'emploi est **long et répétitif**. JobMailer te permet de :

- ✅ Générer un email professionnel en quelques secondes
- ✅ Envoyer ton CV automatiquement selon ta stack technique
- ✅ Suivre l'état de chaque candidature sur un tableau de bord
- ✅ Programmer l'envoi d'emails en masse pendant les heures ouvrables

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🤖 **IA Générative** | GPT-3.5-turbo génère une lettre personnalisée à partir de l'offre d'emploi |
| 📤 **Envoi Automatique** | Envoie les emails via Gmail SMTP avec CV en pièce jointe |
| 📅 **Planificateur** | Un cron job envoie les emails en attente toutes les 10 min (heures ouvrables) |
| 📊 **Tableau de Bord** | Visualise les stats (envoyés, en attente, échoués) en temps réel |
| 📂 **Multi-Stack CV** | Sélectionne automatiquement le bon CV selon la stack (PHP, MERN, Général) |
| 🔁 **Multi-Emails** | Envoie à plusieurs recruteurs en une seule soumission |
| 🛡️ **Anti-doublons** | MongoDB évite d'envoyer deux fois au même email |
| 🐳 **Docker Ready** | Déploiement en production en une seule commande |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        JOBMAILER                            │
│                                                             │
│  ┌────────────────┐        ┌────────────────────────────┐  │
│  │   CLIENT        │        │         SERVER             │  │
│  │  (React/Vite)   │◄──────►│       (Express.js)         │  │
│  │  Port: 5173     │  API   │       Port: 3001           │  │
│  │  (dev)          │        │                            │  │
│  │  Port: 8081     │        │  ┌─────────┐  ┌────────┐  │  │
│  │  (prod)         │        │  │ OpenAI  │  │ Mailer │  │  │
│  └────────────────┘        │  │ Service │  │ (SMTP) │  │  │
│                             │  └─────────┘  └────────┘  │  │
│                             │  ┌─────────────────────┐  │  │
│                             │  │  Scheduler (Cron)   │  │  │
│                             │  └─────────────────────┘  │  │
│                             └────────────┬───────────────┘  │
│                                          │                  │
│                             ┌────────────▼───────────────┐  │
│                             │        MongoDB             │  │
│                             │   (Collection: emails)     │  │
│                             └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Flux d'une Candidature

```
1. 👤 Utilisateur remplit le formulaire (email, stack, offre)
        │
        ▼
2. ✅ Validation Zod (frontend)
        │
        ▼
3. 📡 POST /api/apply → Express Controller
        │
        ▼
4. 🤖 OpenAI génère sujet + corps de l'email (en français)
        │
        ▼
5. 📧 Nodemailer envoie l'email + CV via Gmail SMTP
        │
        ▼
6. 💾 MongoDB enregistre le statut (sent/failed)
        │
        ▼
7. 📊 Dashboard affiche le résultat en temps réel
```

---

## 🔧 Technologies Utilisées

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| ⚛️ React | 19 | Interface utilisateur |
| ⚡ Vite | 6 | Bundler & serveur de dev |
| 🎨 Tailwind CSS | 3 | Styling utilitaire |
| 🧭 React Router | 7 | Navigation entre pages |
| 📝 React Hook Form | 7 | Gestion des formulaires |
| ✅ Zod | 3 | Validation des données |
| 🎭 Shadcn/UI | — | Composants UI accessibles |

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| 🟢 Node.js | 20+ | Environnement d'exécution |
| 🚂 Express | 4 | Serveur HTTP / API REST |
| 🍃 Mongoose | 8 | ODM MongoDB |
| ✉️ Nodemailer | 6 | Envoi d'emails via SMTP |
| 🤖 OpenAI SDK | 4 | Génération IA des emails |
| ⏰ node-cron | 3 | Planificateur de tâches |
| 🔁 concurrently | — | Lancer client + serveur en même temps |

### Infrastructure

| Technologie | Rôle |
|---|---|
| 🐳 Docker | Conteneurisation |
| 🔀 Docker Compose | Orchestration multi-conteneurs |
| 🌐 Nginx | Reverse proxy en production |
| 🍃 MongoDB | Base de données NoSQL |

---

## 📁 Structure du Projet

```
JobMailer/
│
├── 📄 package.json          → Monorepo root (scripts communs)
├── 🐳 docker-compose.yml    → Config production Docker
├── 📝 DEPLOY.md             → Guide de déploiement sur VPS
│
├── 🖥️ server/               → BACKEND (Node.js / Express)
│   ├── 📄 package.json
│   ├── 🐳 Dockerfile
│   ├── 🔒 .env.example      → ⚠️ Copier en .env et remplir !
│   │
│   ├── 📂 assets/           → CVs à envoyer en pièce jointe
│   │   ├── cv.pdf           → CV par défaut
│   │   ├── PHP.pdf          → CV stack PHP
│   │   └── MERN STACK.pdf   → CV stack MERN
│   │
│   └── 📂 src/
│       ├── index.js         → Point d'entrée Express
│       ├── 📂 config/
│       │   └── db.js        → Connexion MongoDB
│       ├── 📂 controllers/
│       │   ├── applyController.js  → Logique de candidature
│       │   └── statsController.js → Statistiques
│       ├── 📂 models/
│       │   └── Email.js     → Schéma MongoDB
│       ├── 📂 routes/
│       │   └── api.js       → Définition des routes API
│       └── 📂 services/
│           ├── openai.js    → Génération email par IA
│           ├── mailer.js    → Envoi email (Nodemailer)
│           └── scheduler.js → Cron job (emails en attente)
│
└── 🌐 client/               → FRONTEND (React / Vite)
    ├── 📄 package.json
    ├── 🐳 Dockerfile
    ├── 🌐 nginx.conf        → Config Nginx production
    ├── ⚡ vite.config.js    → Config Vite + proxy API
    └── 📂 src/
        ├── main.jsx         → Point d'entrée React
        ├── App.jsx          → Router + Layout
        ├── JobForm.jsx      → Formulaire de candidature
        ├── Dashboard.jsx    → Tableau de bord stats
        └── 📂 components/ui/→ Composants Shadcn/UI
```

---

## 🚀 Guide d'Installation

### 📋 Prérequis

Avant de commencer, assure-toi d'avoir installé :

| Outil | Version | Vérification |
|---|---|---|
| 🟢 Node.js | 20 ou + | `node --version` |
| 📦 npm | 10 ou + | `npm --version` |
| 🍃 MongoDB | Local ou Atlas | — |
| 🐳 Docker | Optionnel (prod) | `docker --version` |

Tu auras aussi besoin de :
- 🔑 **Une clé API Gemini** → [Google AI Studio](https://aistudio.google.com/app/apikey)
- 📬 **Un compte Gmail** avec un **mot de passe d'application** (voir ci-dessous)

---

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/ton-username/JobMailer.git
cd JobMailer
```

---

### Étape 2 — Configurer les variables d'environnement

```bash
# Copier le fichier exemple
cp server/.env.example server/.env
```

Ouvre `server/.env` et remplis les valeurs :

```env
PORT=3001
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/jobmailer
# Ou avec MongoDB Atlas :
# MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/jobmailer?retryWrites=true&w=majority&appName=Cluster0

Si tu utilises Atlas, garde uniquement `MONGO_URI` dans `server/.env`. Le serveur se connecte directement via `mongoose.connect(process.env.MONGO_URI)`.

# Gemini
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
# Optionnel (par défaut: gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ton.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx   ← mot de passe d'application (16 caractères)
```

> 💡 **Comment obtenir le mot de passe d'application Gmail ?**
> 1. Va sur [myaccount.google.com](https://myaccount.google.com)
> 2. Sécurité → Vérification en 2 étapes → Active-la
> 3. Cherche "Mots de passe des applications"
> 4. Sélectionne "Autre (nom personnalisé)" → tape "JobMailer"
> 5. Copie le mot de passe généré (16 caractères avec espaces)

---

### Étape 3 — Ajouter ton/tes CV(s)

Place tes fichiers PDF dans le dossier `server/assets/` :

| Fichier | Stack ciblée |
|---|---|
| `cv.pdf` | Candidature générale / spontanée |
| `PHP.pdf` | Postes PHP (Laravel, ) |
| `MERN STACK.pdf` | Postes MERN (React, Node.js) |

> ⚠️ **Les noms de fichiers doivent être exacts** (respecter la casse).

---

### Étape 4 — Personnaliser ton profil

Le profil candidat est injecté dans les prompts IA. Ouvre `server/src/services/openai.js` et modifie la section du profil :

```javascript
// Cherche les lignes avec le profil candidat et remplace :
Nom : Ton Prénom Ton Nom
Poste visé : Développeur Full Stack
Frontend : HTML, CSS, JavaScript, React, Tailwind
Backend : PHP, TypeScript, Node.js, MySQL, MongoDB
// ... adapte selon ton profil
```

---

### Étape 5 — Installer les dépendances

```bash
npm run install:all
```

Cette commande installe les dépendances pour le **root**, le **server** et le **client** en une fois.

---

## ▶️ Lancer le Projet

### Mode Développement (recommandé pour débuter)

```bash
npm run dev
```

Cela lance **simultanément** :
- 🟢 Backend sur [http://localhost:3001](http://localhost:3001)
- ⚛️ Frontend sur [http://localhost:5173](http://localhost:5173)

### Lancer séparément

```bash
# Backend seulement
npm run start:server

# Frontend seulement
npm run dev:client
```

### Vérifier que tout fonctionne

```bash
# Tester l'API backend
curl http://localhost:3001/health
# Réponse attendue : {"status":"ok"}
```

---

## 📖 Guide d'Utilisation

### 🖊️ Page 1 — Formulaire de Candidature (`/`)

Accède à [http://localhost:5173](http://localhost:5173)

![Formulaire](https://via.placeholder.com/800x400?text=Formulaire+de+Candidature)

#### Champs du formulaire

| Champ | Obligatoire | Description | Exemple |
|---|---|---|---|
| **Email(s) recruteur** | ✅ Oui | Un ou plusieurs emails séparés par des virgules | `rh@company.com, contact@startup.fr` |
| **Stack technique** | ❌ Non | Sélectionne le CV adapté + template email | `MERN`, `PHP`, ou laisser vide |
| **Offre d'emploi** | ❌ Non | Colle le texte de l'offre pour personnalisation IA | Texte de l'annonce |

#### Comportement selon les champs remplis

| Situation | Comportement |
|---|---|
| Email + Stack + Offre | 🤖 GPT génère un email personnalisé selon l'offre, envoie avec le CV correspondant |
| Email + Stack (sans offre) | 📝 Utilise un template prédéfini pour la stack choisie |
| Email seulement | 📝 Utilise le template de candidature spontanée générale |
| Plusieurs emails | 📤 Envoie en parallèle à tous les destinataires |

#### Étapes d'utilisation

1. **Saisis l'email** du recruteur (ou plusieurs, séparés par des virgules `,`)
2. **Choisis ta stack** si tu postules à un poste spécifique (PHP ou MERN)
3. **Colle l'offre d'emploi** si tu en as une (recommandé pour un email personnalisé)
4. Clique sur **"Envoyer la candidature"**
5. Attends la confirmation ✅ ou le message d'erreur ❌

---

### 📊 Page 2 — Tableau de Bord (`/dashboard`)

Accède à [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

#### Statistiques affichées

| Carte | Description |
|---|---|
| 📨 **Total** | Nombre total d'emails enregistrés |
| ✅ **Envoyés** | Emails envoyés avec succès |
| ⏳ **En attente** | Emails en attente d'envoi (scheduler) |
| ❌ **Échoués** | Emails qui ont rencontré une erreur |

#### Historique des emails

Le tableau affiche les 10 derniers emails avec :
- **Email** du recruteur
- **Statut** (indicateur coloré : 🟢 envoyé, 🔴 échoué, 🟡 en attente)
- **Date d'envoi**
- **Message d'erreur** si applicable

> 🔄 Le dashboard se rafraîchit automatiquement toutes les **10 secondes**.

---

### ⏰ Le Planificateur d'Emails (Scheduler)

Le serveur tourne un **cron job** qui s'exécute **toutes les 10 minutes** pendant les heures ouvrables :

| Horaires | Jours |
|---|---|
| 08h00 – 11h00 | Lundi – Vendredi |
| 14h00 – 16h00 | Lundi – Vendredi |

**Comment ça fonctionne :**
1. Le scheduler cherche les emails avec le statut `pending` dans MongoDB
2. Il les envoie un par un avec le template par défaut
3. Il met à jour le statut : `sent` ✅ ou `failed` ❌

> 💡 **Cas d'usage :** Si tu veux envoyer des emails en masse à une liste, tu peux les insérer directement en base avec le statut `pending` et le scheduler s'en chargera.

---

## 🐳 Déploiement Docker

### Démarrage rapide

```bash
# Construire et lancer les conteneurs
docker-compose up -d --build

# Accéder à l'application
open http://localhost:8081
```

### Architecture Docker

| Service | Image | Port | Description |
|---|---|---|---|
| `server` | Node.js 20 Alpine | 3001 | API Backend |
| `client` | Nginx + React build | 8081 | Frontend + Reverse Proxy |

### Commandes utiles Docker

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un seul service
docker-compose logs -f server
docker-compose logs -f client

# Arrêter les conteneurs
docker-compose down

# Redémarrer après modification
docker-compose up -d --build

# Entrer dans le conteneur serveur
docker-compose exec server sh
```

### Variables d'environnement en production

Assure-toi que `server/.env` est configuré **avant** de lancer Docker :

```bash
# Vérifie que le fichier existe
cat server/.env
```

> ⚠️ Ne commite jamais ton fichier `.env` sur Git !

---

## 🔌 API Reference

### `POST /api/apply`

Envoie une candidature par email.

**Body (JSON) :**
```json
{
  "email": "recruteur@company.com",
  "stack": "mern",
  "jobOffer": "Nous recherchons un développeur React..."
}
```

**Paramètres :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `email` | `string` | ✅ | Email(s) du recruteur (séparés par `,`) |
| `stack` | `string` | ❌ | Stack technique : `php`, `mern`, ou vide |
| `jobOffer` | `string` | ❌ | Texte de l'offre d'emploi |

**Réponses :**

| Code | Signification |
|---|---|
| `200` | Email(s) envoyé(s) avec succès |
| `400` | Données invalides (email manquant, format incorrect) |
| `500` | Erreur serveur (SMTP, OpenAI, MongoDB) |

---

### `GET /api/stats`

Retourne les statistiques et l'historique des emails.

**Réponse :**
```json
{
  "total": 42,
  "sent": 38,
  "pending": 2,
  "failed": 2,
  "recent": [
    {
      "email": "rh@company.com",
      "status": "sent",
      "sentAt": "2025-03-15T10:30:00.000Z",
      "createdAt": "2025-03-15T10:28:00.000Z"
    }
  ]
}
```

---

### `GET /health`

Vérifie que le serveur est en ligne.

**Réponse :** `{ "status": "ok" }`

---

## 🗄️ Base de Données

### Schéma MongoDB — Collection `emails`

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `email` | `String` | ✅ | Adresse email unique du recruteur |
| `status` | `String` | ✅ | `pending` \| `processing` \| `sent` \| `failed` |
| `sentAt` | `Date` | ❌ | Date et heure d'envoi |
| `error` | `String` | ❌ | Message d'erreur si échec |
| `createdAt` | `Date` | Auto | Date de création (auto) |

### Cycle de vie d'un email

```
[pending] → [processing] → [sent]
                        ↘ [failed]
```

- **pending** : En attente d'envoi (créé mais pas encore traité par le scheduler)
- **processing** : En cours d'envoi (verrou anti-doublon)
- **sent** : Envoyé avec succès
- **failed** : Échec de l'envoi (détails dans le champ `error`)

---

## ❓ FAQ & Dépannage

### 🔴 Problèmes courants

#### "Error: Invalid login" lors de l'envoi d'email

```
✅ Solution : Vérifie que tu utilises un "mot de passe d'application" Gmail
             et non ton mot de passe habituel.
             La vérification en 2 étapes doit être activée.
```

#### "MongoServerError: Connection refused"

```
✅ Solution : Vérifie que MongoDB est bien lancé :
             - Local : sudo systemctl start mongod
             - Ou utilise MongoDB Atlas (cloud gratuit)
```

#### "OpenAI API Error: 401"

```
✅ Solution : Ta clé API OpenAI est invalide ou expirée.
             Génère une nouvelle clé sur platform.openai.com
```

#### Le frontend ne se connecte pas au backend

```
✅ Solution : Vérifie que :
             1. Le backend tourne sur le port 3001
             2. Le fichier vite.config.js a bien le proxy configuré
             3. La variable CLIENT_URL dans .env correspond à ton URL frontend
```

#### "Module not found" au démarrage

```
✅ Solution : Lance npm run install:all pour installer toutes les dépendances
```

---

### 📝 Checklist avant de lancer

- [ ] `server/.env` existe et est rempli
- [ ] Clé OpenAI valide dans `.env`
- [ ] Mot de passe d'application Gmail configuré
- [ ] MongoDB accessible (local ou Atlas)
- [ ] Fichiers CV présents dans `server/assets/`
- [ ] Profil candidat mis à jour dans `server/src/services/openai.js`
- [ ] `npm run install:all` exécuté

---

### 🆘 Obtenir de l'aide

1. **Lis les logs du serveur** : Les erreurs sont affichées dans le terminal
2. **Vérifie ton `.env`** : 90% des problèmes viennent des variables d'environnement
3. **Teste l'API directement** :
   ```bash
   curl -X POST http://localhost:3001/api/apply \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","stack":"mern"}'
   ```

---

## 🤝 Contribution

1. Fork le projet
2. Crée une branche : `git checkout -b feature/ma-fonctionnalite`
3. Commit : `git commit -m "feat: ajout de ma fonctionnalité"`
4. Push : `git push origin feature/ma-fonctionnalite`
5. Ouvre une Pull Request

---

## 👤 Auteur

**Ayoub Oumha**

---

*Bonne chance dans vos candidatures ! 🚀*
