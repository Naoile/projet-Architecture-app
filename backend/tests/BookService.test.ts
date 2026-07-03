import { BookService } from '../src/services/BookService';
import { IBookRepository } from '../src/repositories/interfaces/IBookRepository';
import { Book } from '../src/models/Book';


// Faux repository, juste pour le test — ne touche jamais à une vraie base
class FakeBookRepository implements IBookRepository {
  private books: Book[] = [
    { id: 1, title: 'Le Petit Prince', author: 'Saint-Exupéry', genre: 'Conte', rating: 4.8, price: 7.5 },
    { id: 2, title: '1984', author: 'Orwell', genre: 'Science-fiction', rating: 4.6, price: 9.9 },
    { id: 3, title: 'Dune', author: 'Herbert', genre: 'Science-fiction', rating: 4.9, price: 12.0 },
  ];

  findAll(): Book[] {
    return this.books;
  }

  findById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(() => {
    const fakeRepository = new FakeBookRepository();
    bookService = new BookService(fakeRepository);
  });

  it('retourne tous les livres sans filtre', () => {
    const books = bookService.getAllBooks();
    expect(books).toHaveLength(3);
  });

  it('filtre les livres par genre', () => {
    const books = bookService.getAllBooks({ genre: 'Science-fiction' });
    expect(books).toHaveLength(2);
    expect(books.every(book => book.genre === 'Science-fiction')).toBe(true);
  });

  it('filtre les livres par prix maximum', () => {
    const books = bookService.getAllBooks({ maxPrice: 10 });
    expect(books).toHaveLength(2);
  });

  it('retourne un livre existant par id', () => {
    const book = bookService.getBookById(1);
    expect(book?.title).toBe('Le Petit Prince');
  });

  it('retourne undefined pour un id inexistant', () => {
    const book = bookService.getBookById(999);
    expect(book).toBeUndefined();
  });
});