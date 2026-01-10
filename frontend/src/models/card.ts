// card.ts
export class card {
  private readonly name: string;
  private readonly value: number;
  private readonly suit: string;
  // `isFaceUp` doit pouvoir changer (on retourne la carte), donc non readonly
  private isFaceUp: boolean;

  constructor(name: string, value: number, suit: string, isFaceUp: boolean = true) {
    this.name = name;
    this.value = value;
    this.suit = suit;
    this.isFaceUp = isFaceUp;
  }


  public getNom(): string {
    return this.name;
  }

  public getValue(): number {
    return this.value;
  }

  public getSigne(): string {
    return this.suit;
  }

  public getIsFaceUp(): boolean {
    return this.isFaceUp;
  }

  public flipCard(): void {
    this.isFaceUp = !this.isFaceUp;
  }

  public SetIsFaceUp(value: boolean): void
  {
    this.isFaceUp = value

  }
}

// Fournit un alias export pour la compatibilité avec d'autres fichiers
export { card as Carte };