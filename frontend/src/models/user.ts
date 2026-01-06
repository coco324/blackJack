export class user{

    private id: number
    private mail: string
    private username: string
    private solde: number 

    constructor(id: number, mail: string, username: string, solde: number){
        this.id = id
        this.mail = mail
        this.username = username
        this.solde = solde
    }

    public getId(): number {
        return this.id
    }
    public getMail(): string {
        return this.mail
    }
    public getUsername(): string {
        return this.username
    }
    public getSolde(): number {
        return this.solde
    }
    public setSolde(solde: number): void {
        this.solde = solde
    }
    
}