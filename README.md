# Smart School Companion - Intégration Complète

## 🎯 Objectif
Application de gestion scolaire avec authentification, support PWA, internationalisation et gestion des étudiants, classes et présences.

## ✨ Fonctionnalités Implémentées

### 1. Système d'Authentification (Zustand)
- **Connexion** : Mode démo activé (n'importe quel email/mot de passe fonctionne)
- **Inscription** : Formulaire complet avec sélection de rôle
- **Réinitialisation** : Workflow de récupération de mot de passe
- **Protection** : Routes protégées avec middleware

### 2. Modules Principaux (Offline-First avec Dexie)
- **Étudiants** : CRUD complet avec recherche
- **Classes** : Gestion des classes et affectations
- **Présences** : Marquage par classe avec sélection de date

### 3. Progressive Web App (PWA)
- Manifest pour installation
- Service Worker pour cache offline
- Indicateur de connexion

### 4. Internationalisation (i18n)
- Anglais et Français
- Détection automatique de langue
- Hook `useLanguage` pour changement dynamique

### 5. UI/UX
- Design Tailwind CSS moderne
- Composants réutilisables (Button, Input, Modal, Alert)
- Layout avec Sidebar et Navbar
- Responsive design

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/        # Button, Modal, Alert, OfflineIndicator
│   ├── forms/         # Input, Select, Textarea
│   └── layout/        # Sidebar, Navbar
├── hooks/
│   ├── useAuth.ts     # Authentification
│   ├── useForm.ts     # Gestion de formulaires
│   ├── useStudents.ts # Gestion étudiants
│   ├── useClasses.ts  # Gestion classes
│   └── useAttendance.ts # Gestion présences
├── lib/
│   ├── api.ts         # Client Axios avec intercepteurs
│   ├── db.ts          # Configuration Dexie (IndexedDB)
│   ├── validators.ts  # Schémas Zod
│   └── pwaManager.ts  # Gestion PWA
├── pages/
│   ├── auth/          # Login, Register, ForgotPassword
│   ├── students/      # StudentsPage, StudentForm, StudentDetail
│   ├── classes/       # ClassesPage, ClassForm
│   └── attendance/    # AttendancePage
├── services/
│   └── authService.ts # API calls authentification
├── store/
│   └── authStore.ts   # État global Zustand
├── middleware/
│   ├── authMiddleware.tsx  # ProtectedRoute, PublicRoute
│   └── roleMiddleware.tsx  # RoleProtectedRoute
└── types/
    ├── api.ts         # Types API
    └── auth.ts        # Types Auth
```

## 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Tests
npm test
```

## 🔑 Connexion (Mode Démo)

**Email** : n'importe quelle adresse (ex: `test@test.com`)  
**Mot de passe** : n'importe quel mot de passe (ex: `password`)

L'application fonctionne en mode démo sans backend actif.

## 🛠️ Technologies

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper (offline-first)
- **Axios** - HTTP client
- **React Router** - Routing
- **i18next** - Internationalisation
- **Zod** - Validation
- **Tailwind CSS** - Styling
- **Vitest** - Testing

## 📝 Notes de Développement

- **Mode Démo** : L'authentification utilise un fallback mock si le backend n'est pas disponible
- **Offline-First** : Les données sont stockées localement avec Dexie et synchronisées quand le backend est disponible
- **PWA** : L'application peut être installée sur mobile/desktop
- **Tests** : Configuration Vitest avec tests basiques pour les composants

## 📦 Déploiement

Le code est synchronisé avec le dépôt GitHub :
`https://github.com/mildadiagorossi-arch/smart-school-companion.git`

---

**Développé avec ❤️ par l'équipe Smart School**
