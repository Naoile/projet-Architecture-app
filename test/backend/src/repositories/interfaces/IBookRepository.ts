import { Book } from '../../models/Book';

export interface IBookRepository {
  findAll(): Book[];
  findById(id: number): Book | undefined;
}