// card.ts
export class card {
  // Déclaration explicite des propriétés
  public readonly name: string;
  public readonly value: number;
  public readonly suit: string;

  constructor(name: string, value: number, suit: string) {
    this.name = name;
    this.value = value;
    this.suit = suit;
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
}

// Fournit un alias export pour la compatibilité avec d'autres fichiers
export { card as Carte };