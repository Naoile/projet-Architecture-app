import { Book } from '../../models/Book';

export interface NormalizedAttributes {
  rating: number; // ramené entre 0 et 1, 1 = la meilleure note du catalogue
  price: number;  // 1 = le moins cher du catalogue
}

// rating : on veut le maximiser (note haute = bien), donc normalisation classique
//price : on veut le minimiser (prix bas = bien), donc on inverse le sens
export function normalizeBooks(books: Book[]): Map<number, NormalizedAttributes> {
  const ratings = books.map(b => b.rating);
  const prices = books.map(b => b.price);

  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const result = new Map<number, NormalizedAttributes>();

  for (const book of books) {
    const rating = maxRating === minRating
      ? 1
      : (book.rating - minRating) / (maxRating - minRating);

    const price = maxPrice === minPrice
      ? 1
      : (maxPrice - book.price) / (maxPrice - minPrice); // inversé : moins cher = plus proche de 1

    result.set(book.id, { rating, price });
  }

  return result;
}