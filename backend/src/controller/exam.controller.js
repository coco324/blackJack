import connection from "../config/bd_cnx.js";

export async function InsertExam(req, res) {
    const { value1, value2, value3 } = req.body;
    
    // Validation des paramètres
    if (!value1 || !value2 || !value3) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    try {
        // Exemple d'insertion dans une table "exam"
        const [result] = await connection.execute(
            'INSERT INTO exam (champ1, champ2, champ3) VALUES (?, ?, ?)',
            [value1, value2, value3]
        );

        return res.json({ 
            message: 'Données insérées avec succès', 
            id: result.insertId 
        });
    } catch (err) {
        console.error('Erreur lors de l\'insertion:', err);
        return res.status(500).json({ error: 'Erreur serveur lors de l\'insertion' });
    }
}

export async function GetAllExams(req, res) {
    try {
        const [rows] = await connection.execute('SELECT * FROM exam');
        return res.json({ exams: rows });
    } catch (err) {
        console.error('Erreur lors de la récupération:', err);
        return res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
    }
}
