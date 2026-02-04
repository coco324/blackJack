import connection from "../config/bd_cnx.js";

export async function CreateEvaluation(req, res) {
  const { clarte, frequence, note, commentaire } = req.body || {};

  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  if (!clarte || !frequence || note === undefined || note === null) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  const numericNote = Number(note);
  if (Number.isNaN(numericNote) || numericNote < 0) {
    return res.status(400).json({ error: "Note invalide" });
  }

  if (numericNote < 3 && (!commentaire || commentaire.toString().trim() === "")) {
    return res.status(400).json({ error: "Un commentaire est requis si la note est inférieure à 3" });
  }

  try {
    const sql = `INSERT INTO Evaluation (id_user, clarte, frequence, note, commentaire) VALUES (?, ?, ?, ?, ?)`;
    const params = [userId, clarte, frequence, numericNote, commentaire ?? null];
    const [result] = await connection.execute(sql, params);
    return res.json({ message: "Evaluation enregistrée"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function GetEvaluations(req, res) {
  const isAdmin = req.session?.user?.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  try {
    const sql = `SELECT e.id, e.id_user, e.dateEnvoie, e.clarte, e.frequence, e.note, e.commentaire, e.statut, e.justification FROM Evaluation e ORDER BY e.dateEnvoie DESC`;
    const [rows] = await connection.execute(sql);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function UpdateEvaluationStatus(req, res) {
  const { id, statut, justification } = req.body || {};

  const isAdmin = req.session?.user?.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  if (!id || !statut) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }



  try {
    const sql = `UPDATE Evaluation SET statut = ?, justification = ? WHERE id = ?`;
    const params = [statut, justification ?? null, id];
    await connection.execute(sql, params);
    return res.json({ message: 'Mise à jour effectuée' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
