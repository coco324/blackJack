export default class GameServices {
    // Créer une nouvelle session de jeu
    static async CreateSession(userId: number): Promise<{ sessionId: number, startSolde: number } | null> {
        try {
            const response = await fetch('/api/CreateSession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId}),
            });
            
            if (!response.ok) {
                throw new Error('Erreur création session');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur CreateSession:', error);
            return null;
        }
    }

    // Sauvegarder une partie terminée
    static async SaveGame(sessionId: number, dealerScore: number, hands: any[]) {
        try {
            const response = await fetch('/api/SaveGame', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sessionId, dealerScore, hands })
            });
            
            if (!response.ok) {
                throw new Error('Erreur sauvegarde game');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erreur SaveGame:', error);
            return null;
        }
    }

    // Terminer une session
    static async EndSession(sessionId: number, endSolde: number) {
        try {
            const response = await fetch('/api/EndSession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sessionId, endSolde })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Erreur EndSession:', error);
            return null;
        }
    }

    // Récupérer l'historique des sessions
    static async GetUserSessions() {
        try {
            const response = await fetch('/api/GetUserSessions', {
                method: 'GET',
                credentials: 'include'
            });
            
            return await response.json();
        } catch (error) {
            console.error('Erreur GetUserSessions:', error);
            return null;
        }
    }
}