import { Book } from '../models/Book';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { IBookProvider } from './interfaces/IBookProvider';

export interface BookFilters {
  genre?: string;
  author?: string;
  minRating?: number;
  maxPrice?: number;
}

// BookService implémente IBookProvider : c'est ce qui permet à
// RecommendationService de l'utiliser sans connaître la classe concrète.
export class BookService implements IBookProvider {
  constructor(private bookRepository: IBookRepository) {}

  getAllBooks(filters?: BookFilters): Book[] {
    let books = this.bookRepository.findAll();

    if (filters?.genre) {
      books = books.filter(book => book.genre === filters.genre);
    }
    if (filters?.author) {
      books = books.filter(book => book.author === filters.author);
    }
    if (filters?.minRating !== undefined) {
      books = books.filter(book => book.rating >= filters.minRating!);
    }
    if (filters?.maxPrice !== undefined) {
      books = books.filter(book => book.price <= filters.maxPrice!);
    }

    return books;
  }

  getBookById(id: number): Book | undefined {
    return this.bookRepository.findById(id);
  }
}