import { card } from './card'




export class dealer{
    private main: card[] = []

    public getMain(): card[] {
        return this.main;
    }
    public addCarte(carte: card): void {
        this.main.push(carte);
    }

    public getscore(): number {
        let score = 0;
        for (const c of this.main) {
            if (!c) continue
            score += c.getValue();
        }
        return score;
    }
}