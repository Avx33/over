# EduMaroc — Plateforme d'Enseignement Supérieur au Maroc

Plateforme web full-stack moderne pour l'exploration des universités et grandes écoles du Maroc.

## Stack Technique

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **UI**: Composants Shadcn/UI, Lucide Icons, Framer Motion
- **Backend**: API Routes Next.js, Supabase
- **Auth**: Supabase Authentication (email/password)
- **Base de données**: Supabase PostgreSQL avec Row Level Security
- **Import**: Excel (.xlsx) / CSV via la bibliothèque XLSX et PapaParse

## Fonctionnalités

- ✅ Authentification sécurisée (inscription / connexion)
- ✅ Dashboard utilisateur personnalisé
- ✅ Recherche et filtrage avancés (ville, type, catégorie, programme)
- ✅ Pages de détail pour chaque université
- ✅ Système de favoris
- ✅ Mode sombre / clair
- ✅ Design responsive (mobile-first)
- ✅ Dashboard administrateur
- ✅ Import en masse Excel/CSV
- ✅ Pagination
- ✅ SEO optimisé
- ✅ Animations et squelettes de chargement
- ✅ Notifications toast

## Installation

### 1. Cloner le projet

```bash
cd moroccan-edu-platform
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.local.example` en `.env.local` :

```bash
cp .env.local.example .env.local
```

3. Renseignez vos clés dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialiser la base de données

Dans votre tableau de bord Supabase, ouvrez l'éditeur SQL et exécutez dans l'ordre :

1. **`supabase/migrations/001_initial.sql`** — Crée les tables, RLS et triggers
2. **`supabase/seed.sql`** — Insère les catégories et universités de démo

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Accès Administrateur

Pour accéder au dashboard admin (`/admin`), un utilisateur doit avoir le rôle `admin` dans la table `profiles`.

**Via Supabase SQL Editor :**
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'votre@email.com';
```

---

## Import de données

### Via l'interface admin

1. Connectez-vous avec un compte admin
2. Rendez-vous sur `/admin/import`
3. Uploadez votre fichier Excel ou CSV

### Via le script CLI

```bash
npm run import:data -- --file ./data/universities.xlsx
```

### Format du fichier

| Colonne | Obligatoire | Description |
|---------|-------------|-------------|
| `name` | ✅ | Nom de l'établissement |
| `type` | ✅ | `public` ou `private` |
| `city` | ✅ | Ville (ex: Casablanca) |
| `category` | ❌ | Catégorie (ex: Engineering) |
| `address` | ❌ | Adresse complète |
| `website` | ❌ | URL du site web |
| `email` | ❌ | Email de contact |
| `phone` | ❌ | Numéro de téléphone |
| `instagram` | ❌ | URL Instagram |
| `facebook` | ❌ | URL Facebook |
| `linkedin` | ❌ | URL LinkedIn |
| `programs` | ❌ | Filières séparées par virgules |
| `tuition_min` | ❌ | Frais minimum (MAD/an) |
| `tuition_max` | ❌ | Frais maximum (MAD/an) |
| `languages` | ❌ | Langues séparées par virgules |
| `diplomas` | ❌ | Diplômes séparés par virgules |
| `description` | ❌ | Description de l'établissement |
| `founded_year` | ❌ | Année de fondation |

---

## Structure du projet

```
src/
├── app/
│   ├── (auth)/           # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Pages dashboard utilisateur (protégées)
│   │   ├── dashboard/
│   │   ├── favorites/
│   │   └── profile/
│   ├── admin/            # Dashboard admin (protégé + role=admin)
│   │   ├── universities/
│   │   └── import/
│   ├── universities/     # Pages publiques universités
│   │   └── [id]/
│   ├── api/              # Routes API
│   │   ├── auth/callback/
│   │   ├── universities/
│   │   ├── favorites/
│   │   └── admin/import/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── shared/           # Navbar, Footer, ThemeToggle
│   ├── universities/     # Cards, Filters, Pagination, Skeleton
│   ├── auth/             # LoginForm, RegisterForm
│   ├── dashboard/        # StatsCard
│   └── admin/            # AdminSidebar, UniversityTable, ImportModal
├── lib/
│   ├── supabase/         # client.ts, server.ts
│   ├── utils.ts          # cn(), formatCurrency(), slugify()
│   └── constants.ts      # Villes, types, nav links
├── types/
│   └── index.ts          # TypeScript interfaces
└── middleware.ts          # Protection des routes
supabase/
├── migrations/001_initial.sql
└── seed.sql
scripts/
└── import.ts             # Script CLI d'import
```

---

## Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Définir les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

---

## Licence

MIT — Fait avec ❤️ pour les étudiants marocains.
