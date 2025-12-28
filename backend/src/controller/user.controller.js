import connection from "../config/bd_cnx.js";
import bcrypt from "bcrypt";

export async function CreateUser(req, res) {
    const { mail, password, username } = req.body;
    if (!mail || !password || !username) {
        return res.status(400).send({ error: 'Paramètres manquants' });
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  if (!regex.test(password)) {
    return res.status(400).json({
      error: "Mot de passe non conforme",
      details: [
        "Au moins une lettre minuscule",
        "Au moins une lettre majuscule",
        "Au moins un chiffre",
        "Au moins un caractère spécial",
        "6 caractères minimum"
      ]
    });
  }

    try {
    // Hash le mot de passe
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    req.session.user = { mail, username };

    const [rows] = await connection.execute(
        'CALL InsertUser (?, ?, ?)',
        [mail, hashed, username]
      );

    // Première ligne du premier result set
    const userRow = rows[0][0];

        // Si la procédure renvoie une colonne "error"
    if (userRow && userRow.error === 1) {
      return res.status(401).json({ message: 'Un compte est déjà associé à ce mail' });
    }


    // Stocke les infos dans la session (pas le mot de passe)
    req.session.user = {
      id: userRow.id,
      mail: userRow.mail,
      username: userRow.username,
      solde : userRow.solde,
    };
    
    return res.json({ message: 'Utilisateur créé', user: req.session.user });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};




export async function Login(req, res) {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    // Exécution de la procédure stockée
    const [rows] = await connection.execute(
      'CALL LoginUser(?)',
      [mail]
    );

    // rows[0][0] = première ligne (objet utilisateur)
    const userRow = rows[0][0];

    if (!userRow) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifie le mot de passe avec bcrypt
    const mdpHash = userRow.password;
    const isMatch = await bcrypt.compare(password, mdpHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Stocke les infos dans la session (jamais le mot de passe)
    req.session.user = {
      id: userRow.id,
      mail: userRow.mail,
      username: userRow.username,
      description: userRow.description,
      solde: userRow.solde,
    };

    return res.json({
      message: 'Connexion réussie',
      user: req.session.user
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}



export async function Logout(req, res) {
  req.session.destroy();
  res.send({
    test: `déconnexion réussie`,
  });
};



export async function CheckAuth(req, res) {
  if (req.session.user) {
    // Si la session existe, on renvoie les infos de l'utilisateur
    return res.json({ 
      isConnected: true, 
      user: req.session.user 
    });
  } else {
    // Sinon, on dit qu'il n'est pas connecté (sans erreur 500)
    return res.json({ isConnected: false });
  }
}

export async function GetUserStats(req, res) {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const [result] = await connection.execute(
      'CALL GetUserStats(?)',
      [userId]
    );

    const stats = result[0][0];
    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}