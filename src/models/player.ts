import { card } from './card'



export class player{
    private main: card[] = []

    public getMain(): card[] {
        return this.main;
    }

    public addCarte(carte: card): void {
        this.main.push(carte);
    }
}