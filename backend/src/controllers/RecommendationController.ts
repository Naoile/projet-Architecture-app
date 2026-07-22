import { Request, Response } from 'express';
import { RecommendationService } from '../services/RecommendationService';
import { IBookProvider } from '../services/interfaces/IBookProvider';
import { BarycenterScoringStrategy } from '../services/scoring/BarycenterScoringStrategy';

export class RecommendationController {
  constructor(
    private recommendationService: RecommendationService,
    private bookProvider: IBookProvider
  ) {}

 
  getRecommendations = (req: Request, res: Response): void => {
    const genresParam = req.query.genres as string | undefined;
    const preferredGenres = genresParam ? genresParam.split(',') : [];

    const recommendations = this.recommendationService.recommendBooks(preferredGenres);

    res.json(recommendations);
  };

  // Nouvelle route : scoring par barycentre à partir des favoris envoyés par le front.
  getRecommendationsByProfile = (req: Request, res: Response): void => {
    const favoriteBookIds = Array.isArray(req.body.favoriteBookIds)
      ? req.body.favoriteBookIds.map(Number)
      : [];

    const allBooks = this.bookProvider.getAllBooks();
    const strategy = new BarycenterScoringStrategy(allBooks, favoriteBookIds);

    const recommendations = this.recommendationService.recommendWithStrategy(strategy);

    res.json(recommendations);
  };
}