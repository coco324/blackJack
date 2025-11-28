// pack.ts
import { card } from './card';

export class pack {
  private listCart: card[] = [];

  public constructor() {
    this.shuffle();
  }

  public GetCard(): card {
    const carte = this.listCart.pop();
    if (!carte) {
      throw new Error("Le paquet est vide !");
    }
    return carte;
  }

  public hasCards(): boolean {
    return this.listCart.length > 0;
  }

  public getRemainingCards(): number {
    return this.listCart.length;
  }
  
  public shuffle(): void {
    // Réinitialise le paquet avant de le remplir
    this.listCart = [];
    let symbole: string[] = ['♥', '♣', '♦', '♠'];
    symbole.forEach((element: string) => {
      this.listCart.push(new card('2', 2, element));
      this.listCart.push(new card('3', 3, element));
      this.listCart.push(new card('4', 4, element));
      this.listCart.push(new card('5', 5, element));
      this.listCart.push(new card('6', 6, element));
      this.listCart.push(new card('7', 7, element));
      this.listCart.push(new card('8', 8, element));
      this.listCart.push(new card('9', 9, element));
      this.listCart.push(new card('10', 10, element));
      this.listCart.push(new card('V', 10, element));
      this.listCart.push(new card('D', 10, element));
      this.listCart.push(new card('R', 10, element));
      this.listCart.push(new card('A', 11, element));
    });

    // Fisher–Yates shuffle pour mélanger le tableau de façon aléatoire
    for (let i = this.listCart.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = this.listCart[i] as card; // Assertion de type
      this.listCart[i] = this.listCart[j] as card; // Assertion de type
      this.listCart[j] = tmp;
    }
  }
}