import { dealer } from "./dealer";
import { pack } from "./pack";
import { player } from "./player";
import { card } from "./card";
import GameServices from "../Services/GameServices";
import { hand } from "./hand";

export class game{

    private player: player
    private dealer: dealer
    private pack: pack
    private sessionId?: number
    private gameId?: number

    public constructor(sessionId?: number){
        this.player = new player()
        this.dealer = new dealer()
        this.pack = new pack()
        this.sessionId = sessionId
    }

    
    public setSessionId(sessionId: number): void {
        this.sessionId = sessionId
    }

    public getSessionId(): number | undefined {
        return this.sessionId
    }

    public getGameId(): number | undefined {
        return this.gameId
    }

    public calculateWinnings(): number {
        let totalWinnings = 0
        
        for (const hand of this.player.getHands()) {
            const status = hand.getStatus()
            
            if (status === 'win') {
                // Vérifier si c'est un blackjack naturel
                if (hand.getscore() === 21 && hand.getCards().length === 2 && this.player.getHands().length === 1) {
                    totalWinnings += hand.getBet() * 2.5 // Blackjack paie 3:2 (mise + gain)
                } else {
                    totalWinnings += hand.getBet() * 2 // Victoire normale (mise + gain)
                }
            } else if (status === 'push') {
                totalWinnings += hand.getBet() // Récupère juste la mise
            }
            // Si loose, on ne récupère rien (mise déjà déduite)
        }
        
        return totalWinnings
    }

    //#region [Database Interaction]
    // ✅ Construire les données des mains pour la sauvegarde
    private buildHandsData() {
        const hands = []
        
        // Mains du joueur
        for (let i = 0; i < this.player.getHands().length; i++) {
            const hand = this.player.getHandByIndex(i)
            hands.push({
                playerType: 'player',
                index: i,
                bet: hand.getBet(),
                status: hand.getStatus(),
                score: hand.getscore()
            })
        }

        // Main du dealer
        hands.push({
            playerType: 'dealer',
            index: 0,
            bet: 0,
            status: this.dealer.getscore() > 21 ? 'loose' : 'stop',
            score: this.dealer.getscore()
        })

        return hands
    }

    // ✅ Sauvegarder la partie en base de données
    private async saveGameToDatabase(): Promise<void> {
        if (!this.sessionId) {
            console.log('Pas de sessionId, partie non sauvegardée')
            return
        }

        try {
            const result = await GameServices.SaveGame(
                this.sessionId,
                this.getDealerScore(),
                this.buildHandsData()
            )

            if (result?.gameId) {
                this.gameId = result.gameId
                console.log('✅ Partie sauvegardée, gameId:', this.gameId)
            }
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde de la partie:', error)
        }
    }
    //#endregion


    public canSplit(): boolean {
        const currentHand = this.player.getCurrentHand()
        const cards = currentHand.getCards()
        if (cards.length !== 2) return false
        if (!cards[0] || !cards[1]) return false
        if(this.player.getHands().length >= 4) return false // Limite de 4 mains
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
            return
        }
        
        const hand = this.player.getCurrentHand()
        if (hand.getscore() == 21) {
            hand.setStatus('stop')
            this.nextHand()
        }
    }

    // Vérifie si toutes les mains ont été jouées
    public allHandsPlayed(): boolean {
        return this.player.getHands().every(h => h.getStatus() !== 'start')
    }

    private async playDealer(): Promise<void> {
        // Dealer reveals hidden card
        for (const c of this.dealer.getMain()) {
            c.SetIsFaceUp(true)
        }

        while (this.dealer.getscore() < 17) {
            const c = this.pack.GetCard()
            this.dealer.addCarte(c)
        }
        this.evaluateAll()
        await this.saveGameToDatabase()
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
                c.SetIsFaceUp(true)
            }
        }
        else if (this.player.getscore() === 21) {
            this.player.setStatus('win')
            for (const c of this.dealer.getMain()) {
                c.SetIsFaceUp(true)
            }
        }
        else if (this.dealer.getScoreAllCards() === 21) {
            this.player.setStatus('loose')
            for (const c of this.dealer.getMain()) {
                c.SetIsFaceUp(true)
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


    public getPlayer(): player {
        return this.player
    }

    public getCurrentHand(): hand {
        return this.player.getCurrentHand()
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

        // Move the second card to the new hand 
        newHand.addCarte(cardToMove)
        currentHand.removeCard(1)

        this.playerHit()

        // Give the new hand a card from the pack
        newHand.addCarte(this.pack.GetCard())

        if(cards[0]?.getNom() == 'A' && cards[1]?.getNom() == 'A')
        {
            this.playerStand()
            this.playerStand()
        }
    }

    public playerDouble(): void {
        // Double the bet for the current hand
        this.player.getCurrentHand().setBet(this.player.getCurrentHand().getBet() * 2)
        if(this.player.getCurrentHand().getscore() != 21)
        {
            this.playerHit()
        }
        
        this.playerStand()
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

    public getPlayerScoreByIndexWithAs(index: number): number[]
    {
        const hand = this.player.getHandByIndex(index)
        const cards = hand.getCards()

        // Si blackjack (21), afficher uniquement 21
        if (hand.getscore() === 21) {
            return [21]
        }

        // Calculer le score brut avec tous les As comptés pour 11
        let scoreWithAllAce11 = 0
        let aceCount = 0
        
        for (const c of cards) {
            if (!c.getIsFaceUp()) continue
            scoreWithAllAce11 += c.getValue()
            if (c.getNom() === 'A') {
                aceCount++
            }
        }

        // Si pas d'As, retourner juste le score
        if (aceCount === 0) {
            return [scoreWithAllAce11]
        }

        // Score avec tous les As à 1
        const scoreWithAllAce1 = scoreWithAllAce11 - (10 * aceCount)
        
        // Score avec UN SEUL As à 11 et les autres à 1
        const scoreWithOneAce11 = scoreWithAllAce1 + 10

        // Si on peut avoir un As à 11 sans dépasser 21, afficher les deux valeurs
        if (scoreWithOneAce11 <= 21) {
            return [scoreWithOneAce11, scoreWithAllAce1]
        }

        // Sinon, tous les As sont à 1
        return [scoreWithAllAce1]
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
