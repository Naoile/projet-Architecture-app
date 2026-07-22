import { Book } from '../models/Book';
import { IBookProvider } from './interfaces/IBookProvider';
import { IScoringStrategy } from './scoring/interfaces/IScoringStrategy';

// RecommendationService dépend de l'abstraction IBookProvider,
// pas de la classe concrète BookService.
export class RecommendationService {
  constructor(private bookProvider: IBookProvider) {}

  // Ancienne méthode : bonus simple par genre préféré (gardée pour compatibilité)
  recommendBooks(preferredGenres: string[]): Book[] {
    const books = this.bookProvider.getAllBooks();

    return books
      .map(book => ({
        book,
        score: this.calculateScore(book, preferredGenres),
      }))
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.book);
  }

  private calculateScore(book: Book, preferredGenres: string[]): number {
    let score = book.rating;

    if (preferredGenres.includes(book.genre)) {
      score += 2; // bonus si le genre correspond aux préférences du user
    }

    return score;
  }

  // Nouvelle méthode : scoring par stratégie interchangeable (pattern Strategy).
  // RecommendationService ne sait pas COMMENT le score est calculé (barycentre
  // ou autre chose plus tard), il sait juste appeler .score() sur chaque livre.
  recommendWithStrategy(strategy: IScoringStrategy): Book[] {
    const books = this.bookProvider.getAllBooks();

    return books
      .map(book => ({
        book,
        score: strategy.score(book),
      }))
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.book);
  }
}