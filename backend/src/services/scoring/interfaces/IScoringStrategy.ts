import { Book } from '../../../models/Book';

export interface IScoringStrategy {
  score(book: Book): number;
}