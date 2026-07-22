import { RecommendationService } from '../src/services/RecommendationService';
import { IBookProvider } from '../src/services/interfaces/IBookProvider';
import { Book, } from '../src/models/Book';
import { BookFilters } from '../src/services/BookService';

// Faux provider : il respecte IBookProvider, donc RecommendationService
// peut l'utiliser sans savoir que ce n'est pas un vrai BookService.
class FakeBookProvider implements IBookProvider {
  private books: Book[] = [
    { id: 1, title: 'Le Petit Prince', author: 'Saint-Exupéry', genre: 'Conte', rating: 4.8, price: 7.5 },
    { id: 2, title: '1984', author: 'Orwell', genre: 'Science-fiction', rating: 4.6, price: 9.9 },
    { id: 3, title: 'Dune', author: 'Herbert', genre: 'Science-fiction', rating: 4.9, price: 12.0 },
  ];

  getAllBooks(filters?: BookFilters): Book[] {
    return this.books;
  }
}

describe('RecommendationService', () => {
  let recommendationService: RecommendationService;

  beforeEach(() => {
    const fakeProvider = new FakeBookProvider();
    recommendationService = new RecommendationService(fakeProvider);
  });

  it('retourne tous les livres', () => {
    const recommendations = recommendationService.recommendBooks([]);
    expect(recommendations).toHaveLength(3);
  });

  it('trie les livres par score décroissant sans préférence de genre', () => {
    const recommendations = recommendationService.recommendBooks([]);
    // Sans bonus, le score = la note. Dune (4.9) doit arriver en premier.
    expect(recommendations[0].title).toBe('Dune');
  });

  it('applique le bonus aux genres préférés et change l\'ordre', () => {
    // Le Petit Prince (4.8) + bonus de 2 = 6.8, ça doit passer devant Dune (4.9)
    const recommendations = recommendationService.recommendBooks(['Conte']);
    expect(recommendations[0].title).toBe('Le Petit Prince');
  });
});