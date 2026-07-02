import express from 'express';
import { InMemoryBookRepository } from './repositories/InMemoryBookRepository';
import { BookService } from './services/BookService';
import { BookController } from './controllers/BookController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Injection de dépendance manuelle : on assemble les couches ici
const bookRepository = new InMemoryBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getBookById);

app.get('/', (req, res) => {
  res.json({ message: 'API catalogue de livres opérationnelle' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});