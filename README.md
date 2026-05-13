# Gestion Entreprises CNSS

Application web de gestion et de localisation des entreprises enregistrées auprès de la CNSS. Elle permet à un administrateur CNSS d'enregistrer et de modifier les entreprises, à des gestionnaires autorisés de contribuer, et aux utilisateurs simples de rechercher une entreprise puis de consulter sa localisation.

## Liens

- Application hébergée : https://gestion-entreprises-cnss.onrender.com
- Manuel d'emploi : https://docs.google.com/presentation/d/1hUbrptMRvLWQe3412paHveAs3KNFEEilUH7SAi9Wehk/edit?usp=sharing

## Stack

### Backend

- AdonisJS
- TypeScript
- PostgreSQL

### Frontend

- Inertia.js
- React
- Vite

## Fonctionnalités

- Création unique du compte administrateur CNSS au premier lancement.
- Connexion par email et mot de passe pour les administrateurs, les gestionnaires et les utilisateurs.
- Gestion des droits : l'administrateur peut donner à un autre compte le droit d'enregistrer et de modifier les entreprises.
- Inscription utilisateur avec email reconnu et mot de passe.
- Protection CSRF active sur les requêtes sensibles.
- Sessions HTTP sécurisées avec cookies `httpOnly`, `secure` en production et `sameSite=lax`.
- Limitation temporaire des tentatives de connexion après plusieurs échecs.
- Recherche des entreprises par nom ou adresse.
- Affichage des fiches entreprises avec image, adresse, téléphone et coordonnées.
- Géocodage automatique des adresses via OpenStreetMap Nominatim.
- Mode sombre.
- Aide différente selon le profil : administrateur/gestionnaire ou utilisateur simple.

## Prérequis

- Node.js 24 ou plus
- npm
- PostgreSQL

## Installation

```bash
npm install
```

Copier le fichier d'environnement :

```bash
cp .env.example .env
```

Générer la clé d'application :

```bash
node ace generate:key
```

Configurer la base PostgreSQL dans `.env` :

```env
DB_CONNECTION=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=gestion_entreprises_cnss
```

Lancer les migrations :

```bash
node ace migration:run
```

## Lancement en développement

```bash
npm run dev
```

L'application démarre par défaut sur :

```text
http://localhost:3333
```

## Authentification et sécurité

L'application utilise l'authentification par session d'AdonisJS. Un utilisateur est considéré comme connecté seulement si le guard `web` a créé une vraie session authentifiée.

Les anciens accès visiteurs basés uniquement sur l'email en session ne sont plus utilisés. Un email saisi ne suffit donc plus pour être reconnu comme utilisateur connecté.

Règles principales :

- Les nouveaux mots de passe doivent contenir entre 12 et 128 caractères.
- Les formulaires de connexion administrateur et utilisateur sont limités après 5 échecs pendant une fenêtre de 15 minutes.
- Les routes d'administration passent par le middleware `admin`.
- Les routes de création et de modification d'entreprise passent par le middleware `manageCompanies`.
- Le cookie de session est `httpOnly`, `secure` en production et `sameSite=lax`.
- La protection CSRF est active pour les méthodes `POST`, `PUT`, `PATCH` et `DELETE`.

## Parcours administrateur

Au premier lancement, si aucun administrateur n'existe encore:

1. L'application redirige vers `/login`.
2. La page de connexion affiche le lien `Vous n'avez pas de compte ? S'inscrire`.
3. Le lien ouvre `/signup`.
4. Le premier compte créé devient l'administrateur CNSS.
5. Après inscription, l'administrateur est redirigé vers `/login`.
6. Une fois connecté, il accède à la page d'accueil complète.

L'administrateur peut:

- enregistrer une entreprise;
- modifier une entreprise;
- consulter toutes les pages;
- ouvrir la page `Accès`;
- donner ou retirer le droit de gestion à un autre utilisateur;
- supprimer un compte non administrateur.

## Parcours utilisateur

Pour un utilisateur non administrateur:

1. L'utilisateur ouvre `/user/signup`.
2. Il renseigne son nom, son email et un mot de passe.
3. L'email est vérifié comme adresse reconnue par Google ou Google Workspace.
4. Si l'email est accepté, un compte `viewer` est créé et l'utilisateur est connecté.
5. Les connexions suivantes se font sur `/user/login` avec email et mot de passe.

L'utilisateur peut:

- rechercher une entreprise;
- consulter la fiche d'une entreprise;
- consulter la localisation;
- lire l'aide utilisateur.

L'utilisateur ne voit pas:

- le bouton `Nouvelle entreprise`;
- les pages d'enregistrement et de modification;
- la page de gestion des accès.

## Parcours gestionnaire

Un gestionnaire est un utilisateur non administrateur auquel l'administrateur a donné le droit de gestion depuis `/admin/access`.

Le gestionnaire peut:

- se connecter avec email et mot de passe;
- enregistrer une entreprise;
- modifier une entreprise;
- consulter les pages utilisateur.

Il ne peut pas gérer les accès ni supprimer d'autres comptes.

## Scripts utiles

```bash
npm run dev
```

Lance le serveur de développement avec HMR.

```bash
npm run build
```

Compile l'application pour la production.

```bash
npm run start
```

Lance l'application compilée.

```bash
npm run typecheck
```

Vérifie les types TypeScript côté serveur et côté Inertia.

```bash
npm run lint
```

Lance ESLint sur le projet.

```bash
npm run test
```

Lance les tests Japa.

## Structure principale

```text
app/controllers        Contrôleurs HTTP
app/middleware         Middlewares d'authentification et de droits
app/models             Modèles Lucid
app/services           Services métier, géocodage et sécurité
app/validators         Validateurs VineJS
database/migrations    Migrations de base de données
inertia/layouts        Layout principal
inertia/pages          Pages React Inertia
inertia/css/app.css    Styles globaux
start/routes.ts        Déclaration des routes
```

## Routes importantes

- `/` : accueil et recherche d'entreprise.
- `/user/signup` : inscription utilisateur avec email et mot de passe.
- `/user/login` : connexion utilisateur ou gestionnaire non administrateur.
- `/login` : connexion administrateur ou gestionnaire.
- `/signup` : création initiale de l'administrateur CNSS.
- `/companies` : liste des entreprises.
- `/companies/create` : enregistrement d'une entreprise.
- `/companies/edit` : modification d'une entreprise.
- `/admin/access` : gestion des droits par l'administrateur.
- `/help` : aide adaptée au profil.

## Notes

- La création du compte administrateur CNSS est unique.
- Les utilisateurs ne sont plus identifiés par simple email en session : une vraie connexion par mot de passe est obligatoire.
- Les anciens comptes visiteurs sans mot de passe doivent être recréés ou recevoir un mot de passe par l'administrateur.
- Le géocodage utilise Nominatim et dépend de la qualité de l'adresse fournie.
- Pour de meilleurs résultats, saisir des adresses précises, par exemple : `11, Avenue Lubefu, Ngaliema, Kinshasa, RDC`.
