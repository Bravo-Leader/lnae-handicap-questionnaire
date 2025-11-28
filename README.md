# Questionnaire Commission Handicap

Application web moderne pour la Commission Handicap de la Ligue Nouvelle-Aquitaine d'Échecs. Ce projet permet de collecter les besoins d'accompagnement des clubs concernant l'accueil des personnes en situation de handicap.

## 🎯 Fonctionnalités

### Pour les clubs
- **Questionnaire interactif** avec progression par étapes
- Interface moderne et responsive avec DaisyUI
- Validation des formulaires
- Page de remerciement après soumission

### Pour les administrateurs
- **Panneau d'administration sécurisé** avec authentification
- **3 modes de visualisation** :
  - 📋 Vue Liste : Tableau détaillé avec recherche et filtres
  - 🎴 Vue Cartes : Affichage en grille avec filtres avancés
  - 📊 Vue Statistiques : Graphiques interactifs et analyses
- **Analyses et interprétations** automatiques des données
- **Export des données** en JSON et CSV
- Graphiques variés : camemberts, barres, statistiques détaillées

## 🛠️ Stack Technique

- **Frontend** : Next.js 14, React, TypeScript
- **Styling** : Tailwind CSS, DaisyUI
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Graphiques** : Chart.js, react-chartjs-2
- **Authentification** : JWT, bcryptjs
- **Containerisation** : Docker, Docker Compose

## 📦 Installation

### Prérequis

- Node.js 20+
- Docker et Docker Compose
- Git

### Méthode 1 : Avec Docker (Recommandé)

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd chess
```

2. **Créer le fichier .env**
```bash
cp .env.example .env
```

3. **Modifier le fichier .env** avec vos valeurs :
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/handicap_questionnaire"
JWT_SECRET="votre-secret-jwt-tres-securise"
NEXTAUTH_SECRET="votre-secret-nextauth-tres-securise"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Lancer avec Docker Compose**
```bash
docker-compose up -d
```

L'application sera accessible sur http://localhost:3000

### Méthode 2 : Installation locale

1. **Installer les dépendances**
```bash
npm install
```

2. **Créer le fichier .env**
```bash
cp .env.example .env
```

3. **Démarrer PostgreSQL** (ou utiliser une instance existante)

4. **Modifier DATABASE_URL dans .env**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/handicap_questionnaire"
```

5. **Générer Prisma Client et migrer la base de données**
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. **Créer un compte administrateur** (via Prisma Studio ou script)
```bash
npm run prisma:studio
```
Créez un enregistrement dans la table `admins` avec :
- email: votre email
- password: hash bcrypt de votre mot de passe
- name: votre nom

7. **Lancer l'application en développement**
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🔐 Créer un compte administrateur

### Méthode rapide (Prisma Studio)

```bash
npm run prisma:studio
```

1. Ouvrir la table `admins`
2. Ajouter un nouvel enregistrement
3. Pour le password, utilisez un hash bcrypt (vous pouvez en générer un sur https://bcrypt-generator.com/)

### Avec un script Node.js

Créez un fichier `scripts/create-admin.js` :

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('VotreMotDePasse123!', 10)

  const admin = await prisma.admin.create({
    data: {
      email: 'admin@echecs-nouvelleaquitaine.fr',
      name: 'Hugues GIRAUD',
      password: password,
    },
  })

  console.log('Admin créé:', admin)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Puis exécutez :
```bash
node scripts/create-admin.js
```

## 📖 Utilisation

### Accès au questionnaire
Rendez-vous sur http://localhost:3000 et cliquez sur "Commencer le questionnaire"

### Accès à l'administration
1. Allez sur http://localhost:3000/admin/login
2. Connectez-vous avec vos identifiants admin
3. Accédez au dashboard avec les 3 vues disponibles

### Navigation dans l'admin

- **Vue Liste** : Recherche par nom de club, détails complets en modal
- **Vue Cartes** : Filtres par label et expérience, vue d'ensemble rapide
- **Vue Statistiques** :
  - Analyses et recommandations
  - Graphiques interactifs
  - Statistiques détaillées
  - Export des données

## 🚀 Déploiement en production

### Avec Docker

1. **Build l'image**
```bash
docker build -t handicap-questionnaire .
```

2. **Déployer avec docker-compose**
```bash
docker-compose -f docker-compose.yml up -d
```

### Variables d'environnement de production

⚠️ **Important** : Modifiez ces valeurs en production !

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="generer-une-cle-aleatoire-longue-et-securisee"
NEXTAUTH_SECRET="generer-une-autre-cle-aleatoire-longue-et-securisee"
NEXTAUTH_URL="https://votre-domaine.fr"
```

### Conseils de sécurité

- Utilisez des secrets forts et aléatoires
- Activez HTTPS en production
- Changez les mots de passe par défaut de PostgreSQL
- Limitez l'accès à la base de données
- Activez les backups automatiques

## 📊 Structure du projet

```
chess/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/    # Panneau admin
│   │   │   └── login/         # Connexion admin
│   │   ├── api/
│   │   │   ├── auth/          # Routes d'authentification
│   │   │   └── responses/     # API des réponses
│   │   ├── questionnaire/     # Formulaire public
│   │   └── page.tsx           # Page d'accueil
│   ├── components/
│   │   └── admin/
│   │       ├── ResponseList.tsx    # Vue liste
│   │       ├── ResponseCards.tsx   # Vue cartes
│   │       └── Statistics.tsx      # Vue statistiques
│   └── lib/
│       ├── prisma.ts          # Client Prisma
│       └── auth.ts            # Utilitaires auth
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── docker-compose.yml         # Configuration Docker
├── Dockerfile                 # Image Docker
└── package.json
```

## 🤝 Support

Pour toute question ou problème :
- Email : handicap@echecs-nouvelleaquitaine.fr
- Référent : Hugues GIRAUD

## 📝 Licence

Projet privé - Commission Handicap, Ligue Nouvelle-Aquitaine d'Échecs
