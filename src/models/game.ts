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
        this.dealer.addCarte(this.pack.GetCard());
        this.player.addCarte(this.pack.GetCard());
        this.player.addCarte(this.pack.GetCard());
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
        return c
    }

    // Donne une carte au dealer (pioche) et renvoie la carte ajoutée
    public dealerHit(): card {
        const c = this.pack.GetCard()
        this.dealer.addCarte(c)
        return c
    }

    // Calcul du score du joueur
    public getPlayerScore(): number {
        return this.player.getMain().reduce((sum, c) => sum + c.getValue(), 0)
    }

    // Calcul du score du dealer — si visibleOnly est true, ne compte que la première carte
    public getDealerScore(visibleOnly = true): number {
        const main = this.dealer.getMain()
        if (visibleOnly) {
            const first = main[0]
            if (!first) return 0
            return first.getValue()
        }
        return main.reduce((sum, c) => sum + c.getValue(), 0)
    }

}
