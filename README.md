# Gestion Entreprises CNSS

Application web de gestion et de localisation des entreprises enregistrées auprès de la CNSS. Elle permet à un administrateur CNSS d'enregistrer et de modifier les entreprises, et aux utilisateurs visiteurs de rechercher une entreprise puis de consulter sa localisation.

## Liens

- Application hebergee: https://gestion-entreprises-cnss.onrender.com
- Manuel d'emploi: https://docs.google.com/présentation/d/1hUbrptMRvLWQe3412paHveAs3KNFEEilUH7SAi9Wehk/edit?usp=sharing

## Stack (technologies)

### Backend

- AdonisJS
- TypeScript
- PostgreSQL

### Frontend

- Inertia.js
- React
- Vite

## Fonctionnalites

- Creation unique du compte administrateur CNSS au premier lancement.
- Connexion administrateur avec email et mot de passe.
- Gestion des droits: l'administrateur peut donner à un autre compte le droit d'enregistrer et modifier les entreprises.
- Enregistrement des utilisateurs par adresse email.
- Recherche des entreprises par nom ou adresse.
- Affichage des fiches entreprises avec image, adresse, téléphone et coordonnées.
- Géocodage automatique des adresses via OpenStreetMap Nominatim.
- Mode sombre.
- Aide differente selon le profil: administrateur/gestionnaire ou utilisateur simple.

## Prerequis

- Node.js 24 ou plus
- npm
- PostgreSQL

## Installation

```bash
npm install
```

Copier le fichier d'environnement:

```bash
cp .env.example .env
```

Générer la clé d'application:

```bash
node ace generate:key
```

Configurer la base PostgreSQL dans `.env`:

```env
DB_CONNECTION=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=gestion_entreprises_cnss
```

Lancer les migrations:

```bash
node ace migration:run
```

## Lancement en developpement

```bash
npm run dev
```

L'application demarre par defaut sur:

```text
http://localhost:3333
```

## Parcours administrateur

Au premier lancement, si aucun administrateur n'existe encore:

1. L'application affiche l'animation de chargement.
2. Elle redirige vers la page `Sign up`.
3. Le premier compte créé devient l'administrateur CNSS.
4. Après inscription, l'administrateur est redirigé vers `Login`.
5. Une fois connecté, il accède a la page d'accueil complète.

L'administrateur peut:

- enregistrer une entreprise;
- modifier une entreprise;
- consulter toutes les pages;
- ouvrir la page `Acces`;
- donner ou retirer le droit de gestion à un autre utilisateur.

## Parcours utilisateur

Pour un utilisateur non administrateur:

1. L'application affiche l'animation de chargement.
2. Elle redirige vers l'inscription utilisateur par email.
3. L'email est verifié comme adresse reconnue par Google ou Google Workspace.
4. Si l'email n'est pas reconnu, le message suivant est affiche: `Cette adresse email n'existe pas`.
5. Si l'email est accepté, l'utilisateur arrive sur une page de bienvenue.
6. Le bouton `Chercher une entreprise` ouvre la page d'accueil utilisateur.

L'utilisateur peut:

- rechercher une entreprise;
- consulter la fiche d'une entreprise;
- consulter la localisation;
- lire l'aide utilisateur.

L'utilisateur ne voit pas:

- le bouton `Login`;
- le bouton `Nouvelle entreprise`;
- les pages d'enregistrement et de modification;
- la page de gestion des accès.

## Scripts utiles

```bash
npm run dev
```

Lance le serveur de developpement avec HMR.

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

Verifie les types TypeScript côté serveur et côté Inertia.

```bash
npm run lint
```

Lance ESLint sur le projet.

```bash
npm run test
```

Lance les tests Japa. Actuellement, le projet ne contient pas encore de tests executés.

## Structure principale

```text
app/controllers        Controleurs HTTP
app/middleware         Middlewares d'authentification et de droits
app/models             Modeles Lucid
app/services           Services metier, dont geocodage
app/validators         Validateurs VineJS
database/migrations    Migrations de base de donnees
inertia/layouts        Layout principal
inertia/pages          Pages React Inertia
inertia/css/app.css    Styles globaux
start/routes.ts        Declaration des routes
```

## Routes importantes

- `/` : accueil et recherche d'entreprise.
- `/user/signup` : inscription utilisateur par email.
- `/welcome` : page de bienvenue utilisateur.
- `/login` : connexion administrateur ou gestionnaire.
- `/signup` : création initiale de l'administrateur CNSS.
- `/companies` : liste des entreprises.
- `/companies/create` : enregistrement d'une entreprise.
- `/companies/edit` : modification d'une entreprise.
- `/admin/access` : gestion des droits par l'administrateur.
- `/help` : aide adaptée au profil.

## Notes

- La création du compte administrateur CNSS est unique.
- Les visiteurs sont identifiés par leur email dans la session de leur appareil.
- Le géocodage utilise Nominatim et depend de la qualité de l'adresse fournie.
- Pour de meilleurs resultats, saisir des adresses precises, par exemple: `11, Avenue Lubefu, Ngaliema, Kinshasa, RDC`.
