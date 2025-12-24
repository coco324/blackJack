import connection from "../config/bd_cnx.js";

export async function CreateSession(req, res) {
    const userId = req.session?.user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const [result] = await connection.execute(
            'CALL CreateSession(?)',
            [userId]
        );
        
        res.json(result[0][0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function SaveGame(req, res) {
    const { sessionId, dealerScore, hands } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID requis' });
    }

    try {
        const [result] = await connection.execute(
            'CALL SaveGame(?, ?, ?)',
            [sessionId, dealerScore, JSON.stringify(hands)]
        );

        res.json(result[0][0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function EndSession(req, res) {
    const { sessionId, endSolde } = req.body;

    try {
        await connection.execute(
            'CALL EndSession(?, ?)',
            [sessionId, endSolde]
        );

        res.json({ message: 'Session terminée' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function GetUserSessions(req, res) {
    const userId = req.session?.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const [sessions] = await connection.execute(
            'CALL GetUserSessions(?)',
            [userId]
        );

        res.json({ sessions: sessions[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}