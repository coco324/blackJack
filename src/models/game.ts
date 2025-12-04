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

    public startGame(): void {
        // Logic to start the game goes here
        this.dealer.addCarte(this.pack.GetCard());
        this.dealer.addCarte(this.pack.GetCard(), false); // second card face down
        this.player.addCarte(this.pack.GetCard());
        this.player.addCarte(this.pack.GetCard());

        if (this.player.getscore() === 21 && this.dealer.getScoreAllCards() === 21) {
            this.player.setStatus('push');
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true;
            }
        }
        else if (this.player.getscore() === 21) {
            this.player.setStatus('win');
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true;
            }
        }
        else if (this.dealer.getScoreAllCards() === 21) {
            this.player.setStatus('loose');
            for (const c of this.dealer.getMain()) {
                c.isFaceUp = true;
            }
        }

    }
        // Reset only the hands for a new round, keeping the same pack
        public resetRound(): void {
            // replace player and dealer with fresh ones but keep the same pack
            this.player = new player()
            this.dealer = new dealer()
            // startGame will deal from the existing pack
            this.startGame()
        }

    // Retourne la main du joueur (tableau de `Carte`)
    public getPlayerMain() {
        return this.player.getMain();
    }

    // Retourne la main du dealer (tableau de `Carte`)
    public getDealerMain() {
        return this.dealer.getMain();
    }

    // Donne une carte au joueur (pioche) et renvoie la carte ajoutée
    public playerHit(): card {
        const c = this.pack.GetCard()
        this.player.addCarte(c)
        if (this.player.getscore() > 21) {
            this.player.setStatus('loose');
            for (const c of this.dealer.getMain()) {
            c.isFaceUp = true;
        }
        }
        if (this.player.getscore() === 21) {
            this.playerStand();
        }
        return c
    }

    public playerStand(): void {
        this.player.setStatus('stop');
        // Dealer reveals hidden card
        for (const c of this.dealer.getMain()) {
            c.isFaceUp = true;
        }

        while (this.dealer.getscore() < 17) {
            const c = this.pack.GetCard();
            this.dealer.addCarte(c);
        }
        this.evaluate();
    }

    // Donne une carte au dealer (pioche) et renvoie la carte ajoutée
    public dealerHit(): card {
        const c = this.pack.GetCard()
        this.dealer.addCarte(c)
        return c
    }

    // Calcul du score du joueur
    public getPlayerScore(): number {
        return this.player.getscore();
    }

    // Retourne le statut du joueur
    public getPlayerStatus(): 'start' | 'win' | 'loose' | 'push' | 'stop' {
        return this.player.getStatus();
    }

    // Calcul du score du dealer — si visibleOnly est true, ne compte que la première carte
    public getDealerScore(): number {
        return this.dealer.getscore();
    }

    public evaluate(): void {
        const playerScore = this.getPlayerScore();
        const dealerScore = this.getDealerScore();

        if (playerScore > 21) {
            this.player.setStatus('loose');            
        } else if (dealerScore > 21) {
            this.player.setStatus('win');
        } else if (playerScore > dealerScore) {
            this.player.setStatus('win');
        } else if (playerScore < dealerScore) {
            this.player.setStatus('loose');
        } else {
            this.player.setStatus('push');
        }
    }

}
