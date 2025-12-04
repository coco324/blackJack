import { card } from './card'




export class dealer{
    private main: card[] = []

    public getMain(): card[] {
        return this.main;
    }

    public addCarte(carte: card, faceUp: boolean = true): void {
        carte.isFaceUp = faceUp;
        this.main.push(carte);
    }

    public getscore(): number {
        let score = 0;
        let aceCount = 0;
        for (const c of this.main) {
            if (!c.isFaceUp) continue;
            score += c.getValue();
            if (c.getNom() === 'A') {
                aceCount++;
            }
        }

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    public getScoreAllCards(): number {
        let score = 0;
        let aceCount = 0;
        for (const c of this.main) {
            score += c.getValue();
            if (c.getNom() === 'A') {
                aceCount++;
            }
        }

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }
}