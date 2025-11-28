import { dealer } from "./dealer";
import { pack } from "./pack";
import { player } from "./player";

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

}
