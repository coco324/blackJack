import { dealer } from "./dealer";
import { pack } from "./pack";
import { player } from "./player";
import { card } from "./card";

export class game{

    private player: player[] = [new player()]
    private dealer: dealer
    private pack: pack
    private currentHandIndex: number = 0

    public constructor(){
        this.dealer = new dealer()
        this.pack = new pack()
    }

    // Retourne le joueur courant en garantissant qu'il existe
    private getCurrentPlayer(): player {
        const p = this.player[this.currentHandIndex]
        if (!p) throw new Error('Player not initialized')
        return p
    }

    // Retourne l'index de la main active
    public getCurrentHandIndex(): number {
        return this.currentHandIndex
    }

    // Passe à la main suivante après avoir fini de jouer la main courante
    public nextHand(): void {
        if (this.currentHandIndex < this.player.length - 1) {
            this.currentHandIndex++
        } else {
            // Toutes les mains ont été jouées, on passe au dealer
            this.playDealer()
        }
    }

    // Vérifie si toutes les mains ont été jouées
    public allHandsPlayed(): boolean {
        return this.player.every(p => p.getStatus() !== 'start')
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

        const current = this.getCurrentPlayer()
        current.addCarte(this.pack.GetCard())
        current.addCarte(this.pack.GetCard())

        if (current.getscore() === 21 && this.dealer.getScoreAllCards() === 21) {
            current.setStatus('push')
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true
            }
        }
        else if (current.getscore() === 21) {
            current.setStatus('win')
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true
            }
        }
        else if (this.dealer.getScoreAllCards() === 21) {
            current.setStatus('loose')
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true
            }
        }

    }

        // Reset only the hands for a new round, keeping the same pack
        public resetRound(): void {
            // replace player and dealer with fresh ones but keep the same pack
            this.player = [new player()]
            this.dealer = new dealer()
            this.currentHandIndex = 0
            // startGame will deal from the existing pack
            this.startGame()
        }



//#region [getMain]
    // Retourne la main du joueur (tableau de `Carte`)
    public getPlayerMain() {
        return this.getCurrentPlayer().getMain()
    }

    // Retourne les mains de tous les joueurs (utile pour les splits)
    public getPlayersMain(): card[][] {
        return this.player.map(p => p.getMain())
    }

    // Retourne la main du dealer (tableau de `Carte`)
    public getDealerMain() {
        return this.dealer.getMain();
    }
//#endregion
    




// #region [Player Actions]
// Donne une carte au joueur (pioche) et renvoie la carte ajoutée
    public playerHit(): card {
        const c = this.pack.GetCard()
        const current = this.getCurrentPlayer()
        current.addCarte(c)
        if (current.getscore() > 21) {
            current.setStatus('loose')
            // Passe à la main suivante si bust
            this.nextHand()
        }
        else if (current.getscore() === 21) {
            this.playerStand()
        }
        return c
    }

    public playerStand(): void {
        this.getCurrentPlayer().setStatus('stop')
        // Passe à la main suivante ou joue le dealer
        this.nextHand()
    }

    public playerSplit(): void {
        const current = this.getCurrentPlayer()
        const main = current.getMain()
        const cardToMove = main[1]

        // If there is no second card, cannot split
        if (!cardToMove) return

        // Create the split hand and push it to players
        const newPlayer = new player()
        this.player.push(newPlayer)

        // Move the second card to the new hand (add then remove to preserve object)
        newPlayer.addCarte(cardToMove)
        current.removecard(1)

        // Give the original hand a hit (behaviour preserved from previous implementation)
        this.playerHit()

        // Give the new hand a card from the pack
        newPlayer.addCarte(this.pack.GetCard())
    }

// #endregion

   




// Donne une carte au dealer (pioche) et renvoie la carte ajoutée
    public dealerHit(): card {
        const c = this.pack.GetCard()
        this.dealer.addCarte(c)
        return c
    }

    // Calcul du score du joueur
    public getPlayerScore(): number {
        return this.getCurrentPlayer().getscore()
    }

    public getPlayerScoreByIndex(index: number): number {
        const p = this.player[index]
        if (!p) throw new Error('Player not found')
        return p.getscore()
    }

    // Retourne le statut du joueur
    public getPlayerStatus(): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.getCurrentPlayer().getStatus()
    }

    public getPlayerStatusByIndex(index: number): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        const p = this.player[index]
        if (!p) throw new Error('Player not found')
        return p.getStatus()
    }

    // Calcul du score du dealer — si visibleOnly est true, ne compte que la première carte
    public getDealerScore(): number {
        return this.dealer.getscore();
    }

    public evaluate(): void {
        const playerScore = this.getPlayerScore()
        const dealerScore = this.getDealerScore()
        const current = this.getCurrentPlayer()

        if (playerScore > 21) {
            current.setStatus('loose')
        } else if (dealerScore > 21) {
            current.setStatus('win')
        } else if (playerScore > dealerScore) {
            current.setStatus('win')
        } else if (playerScore < dealerScore) {
            current.setStatus('loose')
        } else {
            current.setStatus('push')
        }
    }

    // Évalue toutes les mains contre le dealer
    private evaluateAll(): void {
        const dealerScore = this.getDealerScore()
        
        for (const p of this.player) {
            const playerScore = p.getscore()
            
            if (playerScore > 21) {
                p.setStatus('loose')
            } else if (dealerScore > 21) {
                p.setStatus('win')
            } else if (playerScore > dealerScore) {
                p.setStatus('win')
            } else if (playerScore < dealerScore) {
                p.setStatus('loose')
            } else {
                p.setStatus('push')
            }
        }
    }

}
