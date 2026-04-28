import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import connection from "./config/bd_cnx.js";
import { CreateUser, Login, Logout, CheckAuth, GetUserStats, GetLeaderboard, GetAllUsers, DeleteUser, UpdateUserSolde } from "./controller/user.controller.js";
import { CreateSession, SaveGame, EndSession, GetUserSessions } from "./controller/game.controller.js";

dotenv.config();

const app = express();
const PORT = 8100;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "b9f3c2e1-4a7d-4e6a-9d2f-8c3a1f7e2d9c$Xv!rTq#Lz@8wP",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

// --- 1. Création du Router ---
const apiRouter = express.Router();

// --- 2. Définition des Routes sur le Router ---
// On ne met pas "/api" ici, car on le fera au moment du app.use
apiRouter.get('/checkAuth', CheckAuth);
apiRouter.post("/CreateUser", CreateUser);
apiRouter.post("/Login", Login);
apiRouter.post("/Logout", Logout);
apiRouter.get("/GetUserStats", GetUserStats);
apiRouter.get("/GetLeaderboard", GetLeaderboard);
apiRouter.get("/GetAllUsers", GetAllUsers);
apiRouter.post("/DeleteUser", DeleteUser);
apiRouter.post("/UpdateUserSolde", UpdateUserSolde);

// Route de test BDD (accessible via /api/)
apiRouter.get("/", async (req, res) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM User");
    res.send({
      users: rows,
    });
  } catch (error) {
    console.error("Erreur de BDD:", error);
    res.status(500).send("Erreur serveur");
  }
});

// Game routes
apiRouter.post("/CreateSession", CreateSession);
apiRouter.post("/SaveGame", SaveGame);
apiRouter.post("/EndSession", EndSession);
apiRouter.get("/GetUserSessions", GetUserSessions);

// --- 3. Branchement du Router sur le préfixe /api ---
// C'est cette ligne qui fait que toutes tes routes commencent par /api
app.use('', apiRouter);

// --- Démarrage du serveur ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});