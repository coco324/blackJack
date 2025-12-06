import { card } from './card'
import { hand } from './hand'

export class player {
    private hands: hand[] = [new hand()]
    private currentHandIndex: number = 0

    // Retourne toutes les mains du joueur
    public getHands(): hand[] {
        return this.hands
    }

    // Retourne la main courante
    public getCurrentHand(): hand {
        const h = this.hands[this.currentHandIndex]
        if (!h) throw new Error('Hand not initialized')
        return h
    }

    // Retourne une main spécifique par index
    public getHandByIndex(index: number): hand {
        const h = this.hands[index]
        if (!h) throw new Error('Hand not found')
        return h
    }

    // Retourne l'index de la main courante
    public getCurrentHandIndex(): number {
        return this.currentHandIndex
    }

    // Passe à la main suivante
    public nextHand(): boolean {
        if (this.currentHandIndex < this.hands.length - 1) {
            this.currentHandIndex++
            return true
        }
        return false // Plus de mains à jouer
    }

    // Crée une nouvelle main (pour le split)
    public addHand(): hand {
        const newHand = new hand()
        this.hands.push(newHand)
        return newHand
    }

    // Reset pour une nouvelle partie
    public reset(): void {
        this.hands = [new hand()]
        this.currentHandIndex = 0
    }

    // Méthodes de compatibilité qui délèguent à la main courante
    public getMain(): card[] {
        return this.getCurrentHand().getCards()
    }

    public addCarte(carte: card): void {
        this.getCurrentHand().addCarte(carte)
    }

    public getscore(): number {
        return this.getCurrentHand().getscore()
    }

    public getStatus(): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.getCurrentHand().getStatus()
    }

    public setStatus(newStatus: 'start' | 'win' | 'loose' | 'push' | 'stop'): void {
        this.getCurrentHand().setStatus(newStatus)
    }

    public removecard(index: number): void {
        this.getCurrentHand().removeCard(index)
    }
}