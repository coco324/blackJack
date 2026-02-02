import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import connection from "./config/bd_cnx.js";
import { CreateUser,Login,Logout,CheckAuth,GetUserStats, GetLeaderboard ,GetAllUsers } from "./controller/user.controller.js";
import { CreateSession, SaveGame, EndSession, GetUserSessions } from "./controller/game.controller.js";


dotenv.config();

const app = express();
const PORT = 3000; // Il est souvent bon de définir le port dans une variable

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

// --- Routes ---

app.get('/checkAuth', CheckAuth);
app.post("/CreateUser", CreateUser);
app.post("/Login", Login);
app.post("/Logout", Logout);
app.get("/GetUserStats", GetUserStats);
app.get("/GetLeaderboard",GetLeaderboard);
app.get("/GetAllUsers",GetAllUsers)
app.get("/", async (req, res) => {
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

// game routes
app.post("/CreateSession", CreateSession);
app.post("/SaveGame", SaveGame);
app.post("/EndSession", EndSession);
app.get("/GetUserSessions", GetUserSessions);

// --- Démarrage du serveur (À LA FIN) ---
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});