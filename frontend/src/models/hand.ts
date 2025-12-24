import { card } from './card'

export class hand {
    private cards: card[] = []
    private status: 'start' | 'win' | 'loose' | 'push' | 'stop' = 'start'
    private bet: number = 0 

    public getCards(): card[] {
        return this.cards
    }

    public addCarte(carte: card): void {
        this.cards.push(carte)
    }

    public removeCard(index: number): void {
        if (index >= 0 && index < this.cards.length) {
            this.cards.splice(index, 1)
        }
    }

    public getscore(): number {
        let score = 0
        let aceCount = 0
        for (const c of this.cards) {
            if (!c.isFaceUp) continue
            score += c.getValue()
            if (c.getNom() === 'A') {
                aceCount++
            }
        }

        while (score > 21 && aceCount > 0) {
            score -= 10
            aceCount--
        }
        return score
    }

    public getStatus(): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.status
    }

    public setStatus(newStatus: 'start' | 'win' | 'loose' | 'push' | 'stop'): void {
        this.status = newStatus
    }
}
