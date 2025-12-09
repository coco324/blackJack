import { dealer } from "./dealer";
import { pack } from "./pack";
import { player } from "./player";
import { card } from "./card";

export class game{

    private player: player
    private dealer: dealer
    private pack: pack

    public constructor(){
        this.player = new player()
        this.dealer = new dealer()
        this.pack = new pack()
    }

    public canSplit(): boolean {
        const currentHand = this.player.getCurrentHand()
        const cards = currentHand.getCards()
        if (cards.length !== 2) return false
        if (!cards[0] || !cards[1]) return false
        return cards[0].getValue() === cards[1].getValue()
    }



    // Retourne l'index de la main active
    public getCurrentHandIndex(): number {
        return this.player.getCurrentHandIndex()
    }

    // Passe à la main suivante après avoir fini de jouer la main courante
    public nextHand(): void {
        const hasNext = this.player.nextHand()
        if (!hasNext) {
            // Toutes les mains ont été jouées, on passe au dealer
            this.playDealer()
        }
    }

    // Vérifie si toutes les mains ont été jouées
    public allHandsPlayed(): boolean {
        return this.player.getHands().every(h => h.getStatus() !== 'start')
    }

    private playDealer(): void {
        // Dealer reveals hidden card
        for (const c of this.dealer.getMain()) {
            c.isFaceUp = true
        }

        while (this.dealer.getscore() < 17) {
            const c = this.pack.GetCard()
            this.dealer.addCarte(c)
        }
        this.evaluateAll()
    }

    public startGame(): void {
        // Logic to start the game goes here
        this.dealer.addCarte(this.pack.GetCard())
        this.dealer.addCarte(this.pack.GetCard(), false) // second card face down

        this.player.addCarte(this.pack.GetCard())
        this.player.addCarte(this.pack.GetCard())

        if (this.player.getscore() === 21 && this.dealer.getScoreAllCards() === 21) {
            this.player.setStatus('push')
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true
            }
        }
        else if (this.player.getscore() === 21) {
            this.player.setStatus('win')
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true
            }
        }
        else if (this.dealer.getScoreAllCards() === 21) {
            this.player.setStatus('loose')
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true
            }
        }

    }

        // Reset only the hands for a new round, keeping the same pack
        public resetRound(): void {
            // replace player and dealer with fresh ones but keep the same pack
            this.player.reset()
            this.dealer = new dealer()
            // startGame will deal from the existing pack
            this.startGame()
        }



//#region [getMain]
    // Retourne la main courante du joueur (tableau de `Carte`)
    public getPlayerMain() {
        return this.player.getMain()
    }

    // Retourne toutes les mains du joueur (utile pour les splits)
    public getPlayersMain(): card[][] {
        return this.player.getHands().map(h => h.getCards())
    }

    // Retourne la main du dealer (tableau de `Carte`)
    public getDealerMain() {
        return this.dealer.getMain()
    }
//#endregion
    




// #region [Player Actions]
// Donne une carte au joueur (pioche) et renvoie la carte ajoutée
    public playerHit(): card {
        const c = this.pack.GetCard()
        this.player.addCarte(c)
        if (this.player.getscore() > 21) {
            this.player.setStatus('loose')
            // Passe à la main suivante si bust
            this.nextHand()
        }
        else if (this.player.getscore() === 21) {
            this.playerStand()
        }
        return c
    }

    public playerStand(): void {
        this.player.setStatus('stop')
        // Passe à la main suivante ou joue le dealer
        this.nextHand()
    }

    public playerSplit(): void {
        const currentHand = this.player.getCurrentHand()
        const cards = currentHand.getCards()
        const cardToMove = cards[1]

        // If there is no second card, cannot split
        if (!cardToMove) return

        // Create the split hand
        const newHand = this.player.addHand()

        // Move the second card to the new hand (add then remove to preserve object)
        newHand.addCarte(cardToMove)
        currentHand.removeCard(1)

        // Give the original hand a hit (behaviour preserved from previous implementation)
        this.playerHit()

        // Give the new hand a card from the pack
        newHand.addCarte(this.pack.GetCard())
    }

// #endregion

   




// Donne une carte au dealer (pioche) et renvoie la carte ajoutée
    public dealerHit(): card {
        const c = this.pack.GetCard()
        this.dealer.addCarte(c)
        return c
    }

    // Calcul du score du joueur courant
    public getPlayerScore(): number {
        return this.player.getscore()
    }

    public getPlayerScoreByIndex(index: number): number {
        return this.player.getHandByIndex(index).getscore()
    }

    // Retourne le statut du joueur courant
    public getPlayerStatus(): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.player.getStatus()
    }

    public getPlayerStatusByIndex(index: number): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.player.getHandByIndex(index).getStatus()
    }

    // Calcul du score du dealer — si visibleOnly est true, ne compte que la première carte
    public getDealerScore(): number {
        return this.dealer.getscore();
    }

    public evaluate(): void {
        const playerScore = this.getPlayerScore()
        const dealerScore = this.getDealerScore()

        if (playerScore > 21) {
            this.player.setStatus('loose')
        } else if (dealerScore > 21) {
            this.player.setStatus('win')
        } else if (playerScore > dealerScore) {
            this.player.setStatus('win')
        } else if (playerScore < dealerScore) {
            this.player.setStatus('loose')
        } else {
            this.player.setStatus('push')
        }
    }

    // Évalue toutes les mains contre le dealer
    private evaluateAll(): void {
        const dealerScore = this.getDealerScore()
        
        for (const hand of this.player.getHands()) {
            const playerScore = hand.getscore()
            
            if (playerScore > 21) {
                hand.setStatus('loose')
            } else if (dealerScore > 21) {
                hand.setStatus('win')
            } else if (playerScore > dealerScore) {
                hand.setStatus('win')
            } else if (playerScore < dealerScore) {
                hand.setStatus('loose')
            } else {
                hand.setStatus('push')
            }
        }
    }

}
