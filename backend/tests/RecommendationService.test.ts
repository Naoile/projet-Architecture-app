import { RecommendationService } from '../src/services/RecommendationService';
import { IBookProvider } from '../src/services/interfaces/IBookProvider';
import { BarycenterScoringStrategy } from '../src/services/scoring/BarycenterScoringStrategy';
import { Book } from '../src/models/Book';
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
  let fakeProvider: FakeBookProvider;

  beforeEach(() => {
    fakeProvider = new FakeBookProvider();
    recommendationService = new RecommendationService(fakeProvider);
  });

  it('retourne tous les livres', () => {
    const recommendations = recommendationService.recommendBooks([]);
    expect(recommendations).toHaveLength(3);
  });

  it('trie les livres par score décroissant sans préférence de genre', () => {
    const recommendations = recommendationService.recommendBooks([]);
    expect(recommendations[0].title).toBe('Dune');
  });

  it('applique le bonus aux genres préférés et change l\'ordre', () => {
    const recommendations = recommendationService.recommendBooks(['Conte']);
    expect(recommendations[0].title).toBe('Le Petit Prince');
  });

  it('deux profils utilisateur différents donnent deux classements différents (barycentre)', () => {
    const allBooks = fakeProvider.getAllBooks();

    // Profil A : aime "Le Petit Prince" (pas cher, bien noté)
    const strategyA = new BarycenterScoringStrategy(allBooks, [1]);
    const recommendationsA = recommendationService.recommendWithStrategy(strategyA);

    // Profil B : aime "Dune" (le plus cher du catalogue)
    const strategyB = new BarycenterScoringStrategy(allBooks, [3]);
    const recommendationsB = recommendationService.recommendWithStrategy(strategyB);

    // Les deux classements doivent être différents : c'est la preuve
    // que le profil utilisateur influence bien le résultat.
    expect(recommendationsA.map(b => b.id)).not.toEqual(recommendationsB.map(b => b.id));
  });

  it('sans favoris, le barycentre renvoie un profil neutre', () => {
    const allBooks = fakeProvider.getAllBooks();
    const strategy = new BarycenterScoringStrategy(allBooks, []);
    const recommendations = recommendationService.recommendWithStrategy(strategy);

    expect(recommendations).toHaveLength(3);
  });
});