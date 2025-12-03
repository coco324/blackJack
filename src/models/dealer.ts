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
        for (const c of this.main) {
            if (!c.isFaceUp) continue;
            score += c.getValue();
        }
        return score;
    }

    public getScoreAllCards(): number {
        let score = 0;
        for (const c of this.main) {
            score += c.getValue();
        }
        return score;
    }
}