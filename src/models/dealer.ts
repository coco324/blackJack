import { card } from './card'




export class dealer{
    private main: card[] = []

    public getMain(): card[] {
        return this.main;
    }
    public addCarte(carte: card): void {
        this.main.push(carte);
    }
}