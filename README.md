# BlackJack

Résumé
------
BlackJack est une application web composée d'un backend Node.js/Express et d'un frontend Vue 3 (Vite). Elle permet à des utilisateurs de s'inscrire, se connecter, jouer à des parties de BlackJack, et consulter un classement.

Description du projet
---------------------
- Frontend : Vue 3, TypeScript, Vite. Code principal dans `frontend/src`.
- Backend : Node.js, Express, sessions (`express-session`) et connexion MySQL via `mysql2`. Code dans `backend/src`.
- Base de données : MySQL pour stocker les utilisateurs, soldes et sessions de jeu.

Guide d'installation 
---------------------------------
Prérequis : Node.js (16+ recommandé), npm, MySQL.

1) Installer le backend

```bash
cd backend
npm ci
npm run dev    # lance en développement avec nodemon
```

2) Installer le frontend

```bash
cd frontend
npm ci
npm run dev    # lance le serveur de développement Vite
```
Ensuite rendez-vous sur http://localhost:5173/

Guide utilisateur
------------------
- Écran `home` : point d'entrée, navigation vers Jouer, Classement, Règles, Connexion/Inscription.
- Écran `login` : connexion par email et mot de passe. Après connexion, accès aux parties et au solde.
- Écran `registration` : création de compte (email, username, mot de passe).
- Écran `game` : interface de jeu BlackJack. Actions : Tirer, Rester, Split, Double Nouvelle partie. 
- Écran `leaderboard` : classement des joueurs (scores/statistiques) récupéré depuis l'API.
- Écran `rules` : présentation des règles du BlackJack et du comptage des points.

