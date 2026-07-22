import { Book } from '../../models/Book';
import { BookFilters } from '../BookService';

// Interface d'abstraction : RecommendationService dépend de ça,
// et non de la classe concrète BookService.
export interface IBookProvider {
  getAllBooks(filters?: BookFilters): Book[];
}