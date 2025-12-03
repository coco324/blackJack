import { card } from './card'



export class player{
    private main: card[] = []
    private status: 'start' | 'win' | 'loose' | 'push' | 'stop' = 'start'

    public getMain(): card[] {
        return this.main;
    }

    public addCarte(carte: card): void {
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

    public getStatus(): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.status;
    }

    public setStatus(newStatus: 'start' | 'win' | 'loose' | 'push' | 'stop'): void {
        this.status = newStatus;
    }
}