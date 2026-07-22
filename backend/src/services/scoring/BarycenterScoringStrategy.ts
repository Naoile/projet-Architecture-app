import { Book } from '../../models/Book';
import { IScoringStrategy } from './interfaces/IScoringStrategy';
import { normalizeBooks, NormalizedAttributes } from './normalizeBooks';

// Stratégie de scoring par barycentre :
//on calcule le "profil moyen" de l'utilisateur à partir des livres qu'il a aimés
// on donne un meilleur score aux livres proches de ce profil
export class BarycenterScoringStrategy implements IScoringStrategy {
  private normalizedByBookId: Map<number, NormalizedAttributes>;
  private userProfile: NormalizedAttributes;

  constructor(allBooks: Book[], favoriteBookIds: number[]) {
    this.normalizedByBookId = normalizeBooks(allBooks);
    this.userProfile = this.buildUserProfile(favoriteBookIds);
  }

  // Le profil utilisateur = la moyenne (barycentre) des attributs normalisés
  // des livres favoris. Sans favoris, on prend un profil neutre (0.5 partout).
  private buildUserProfile(favoriteBookIds: number[]): NormalizedAttributes {
    const favorites = favoriteBookIds
      .map(id => this.normalizedByBookId.get(id))
      .filter((attrs): attrs is NormalizedAttributes => attrs !== undefined);

    if (favorites.length === 0) {
      return { rating: 0.5, price: 0.5 };
    }

    const sum = favorites.reduce(
      (acc, attrs) => ({
        rating: acc.rating + attrs.rating,
        price: acc.price + attrs.price,
      }),
      { rating: 0, price: 0 }
    );

    return {
      rating: sum.rating / favorites.length,
      price: sum.price / favorites.length,
    };
  }

  // Score = inverse de la distance entre le livre et le profil utilisateur.
  // Plus le livre est proche du profil (distance faible), plus le score est haut.
  score(book: Book): number {
    const attrs = this.normalizedByBookId.get(book.id);
    if (!attrs) return 0;

    const distance = Math.sqrt(
      Math.pow(attrs.rating - this.userProfile.rating, 2) +
      Math.pow(attrs.price - this.userProfile.price, 2)
    );

    return 1 / (1 + distance); 
  }
}