import express from 'express';
import { InMemoryBookRepository } from './repositories/InMemoryBookRepository';
import { BookService } from './services/BookService';
import { BookController } from './controllers/BookController';
import { RecommendationService } from './services/RecommendationService';
import { RecommendationController } from './controllers/RecommendationController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Injection de dépendance manuelle : on assemble les couches ici
const bookRepository = new InMemoryBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

// RecommendationService dépend de BookService (pas d'un repository)
const recommendationService = new RecommendationService(bookService);
const recommendationController = new RecommendationController(recommendationService);

app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getBookById);
app.get('/recommendation', recommendationController.getRecommendations);

app.get('/', (req, res) => {
  res.json({ message: 'API catalogue de livres opérationnelle' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});