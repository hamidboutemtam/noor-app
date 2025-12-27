# Noor - Application de Citations Islamiques

Application web de motivation pour musulmans, avec des citations authentiques du Coran, hadiths sahih et messages inspirants.

## ✨ Fonctionnalités

- 📖 **Citations authentiques** : Coran, Hadiths Sahih, messages de motivation
- 🎯 **Personnalisation par humeur** : 8 états émotionnels disponibles
- 👤 **Profils utilisateurs** : Particulier ou Entrepreneur
- 🛡️ **Mode Épreuve** : Messages de patience et réconfort
- ❤️ **Favoris** : Sauvegarde des citations préférées
- 🌙 **Mode sombre** : Thème clair/sombre
- 📱 **PWA Ready** : Installable sur mobile
- 🔄 **Synchronisation Supabase** : Base de données en temps réel

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Un projet Supabase (optionnel pour le mode démo)

### Installation rapide

```bash
# Cloner le projet
git clone <repo-url>
cd noor-app

# Installer les dépendances
npm install

# Copier le fichier de configuration
cp .env.example .env

# Lancer en développement
npm run dev
```

### Configuration Supabase (optionnel)

1. Créez un projet sur [supabase.com](https://supabase.com)

2. Exécutez le script SQL dans le SQL Editor de Supabase :
   ```
   supabase/init.sql
   ```

3. Configurez les variables d'environnement dans `.env` :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-anon-key
   ```

4. Relancez l'application

## 📊 Alimenter la base de données

### Option 1 : Workflow n8n (recommandé)

Importez le workflow n8n fourni (`NOOR_-_Agent_IA_Génération_Citations.json`) pour générer automatiquement des citations via OpenRouter/Claude.

Configuration requise :
- Credentials OpenRouter avec clé API
- Credentials Supabase (Service Role Key pour les insertions)

### Option 2 : Insertion manuelle

Utilisez le SQL Editor de Supabase pour insérer des citations :

```sql
INSERT INTO citations (text_fr, text_ar, source_type, source_ref, moods, target, epreuve) 
VALUES (
  'Votre citation en français',
  'النص بالعربية',
  'quran', -- ou hadith_sahih, hadith, action, rappel, sagesse
  'Sourate X, Y:Z',
  ARRAY['motivation', 'stress'], -- humeurs associées
  ARRAY['particulier', 'entrepreneur'], -- cibles
  false -- true si message d'épreuve
);
```

### Option 3 : API Supabase

```javascript
const { data, error } = await supabase
  .from('citations')
  .insert({
    text_fr: 'Citation...',
    text_ar: 'العربية...',
    source_type: 'quran',
    source_ref: 'Sourate X',
    moods: ['motivation'],
    target: ['particulier'],
    epreuve: false
  });
```

## 🏗️ Structure du projet

```
noor-app/
├── src/
│   ├── components/       # Composants React
│   │   ├── ui/          # Composants UI réutilisables
│   │   └── CitationCard.tsx
│   ├── contexts/        # Contextes React (état global)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilitaires et configuration
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services (Supabase)
│   └── types/           # Types TypeScript
├── supabase/
│   └── init.sql         # Script d'initialisation DB
├── public/              # Assets statiques
└── .env.example         # Variables d'environnement
```

## 🎨 Technologies

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS, Framer Motion
- **Backend** : Supabase (PostgreSQL, Auth, Real-time)
- **Icons** : Lucide React

## 📱 Captures d'écran

L'application propose une interface épurée et apaisante :

- Page d'accueil avec sélection d'humeur
- Affichage des citations avec texte arabe et français
- Mode épreuve pour les moments difficiles
- Gestion des favoris

## 🔒 Sécurité

- Row Level Security (RLS) sur toutes les tables
- Pas de données sensibles côté client
- Authentification optionnelle via Supabase Auth
- CORS configuré pour votre domaine

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une PR.

## 🙏 Crédits

- Citations du Coran : Traductions vérifiées
- Hadiths : Sources Sahih uniquement (Bukhari, Muslim)
- Design inspiré par les principes islamiques de sobriété

---

**Noor** signifie "lumière" en arabe (نور). Cette application vise à apporter lumière et motivation dans le quotidien des musulmans.
