import { Request, Response } from 'express';
import { BookService } from '../services/BookService';

export class BookController {
  constructor(private bookService: BookService) {}

  getAllBooks = (req: Request, res: Response): void => {
    const { genre, author, minRating, maxPrice } = req.query;

    const books = this.bookService.getAllBooks({
      genre: genre as string | undefined,
      author: author as string | undefined,
      minRating: minRating ? Number(minRating) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

    res.json(books);
  };

  getBookById = (req: Request, res: Response): void => {
    const id = Number(req.params.id);
    const book = this.bookService.getBookById(id);

    if (!book) {
      res.status(404).json({ message: 'Livre non trouvé' });
      return;
    }

    res.json(book);
  };
}