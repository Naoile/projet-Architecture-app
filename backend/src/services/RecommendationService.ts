import { Book } from '../models/Book';
import { IBookProvider } from './interfaces/IBookProvider';

// RecommendationService dépend de l'abstraction IBookProvider,
// pas de la classe concrète BookService.
export class RecommendationService {
  constructor(private bookProvider: IBookProvider) {}

  recommendBooks(preferredGenres: string[]): Book[] {
    //On récupère tous les livres en réutilisant la logique déjà écrite dasn BookService
    const books = this.bookProvider.getAllBooks();

    return books
    //Pour chaiuqe livres on calcule son score et on garde les deux ensemble
      .map(book => ({
        book,
        score: this.calculateScore(book, preferredGenres),
      }))
      //Tri décroissant, le score le plus haut arrive en haut
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
}