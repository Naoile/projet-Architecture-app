import { Book } from '../models/Book';
import { IBookRepository } from './interfaces/IBookRepository';

export class InMemoryBookRepository implements IBookRepository {
  private books: Book[] = [
    { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', genre: 'Conte', rating: 4.8, price: 7.5 },
    { id: 2, title: '1984', author: 'George Orwell', genre: 'Science-fiction', rating: 4.6, price: 9.9 },
    { id: 3, title: 'L\'Étranger', author: 'Albert Camus', genre: 'Philosophie', rating: 4.3, price: 8.2 },
  ];

  findAll(): Book[] {
    return this.books;
  }

  findById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}