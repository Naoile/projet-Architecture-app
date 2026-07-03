import { Book } from '../models/Book';
import { BookService } from './BookService';

export class RecommendationService {
  constructor(private bookService: BookService) {}

  recommendBooks(preferredGenres: string[]): Book[] {
    //On récupère tous les livres en réutilisant la logique déjà écrite dasn BookService
    const books = this.bookService.getAllBooks();

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