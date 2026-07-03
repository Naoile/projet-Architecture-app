import { Request, Response } from 'express';
import { RecommendationService } from '../services/RecommendationService';

export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  getRecommendations = (req: Request, res: Response): void => {
   
    const genresParam = req.query.genres as string | undefined;
    // Si le paramètre est absent, on part sur un tableau vide, dasn ce cas on ne donne pas de bonus et on renvoie les livres triés par note
    const preferredGenres = genresParam ? genresParam.split(',') : [];

    const recommendations = this.recommendationService.recommendBooks(preferredGenres);

    res.json(recommendations);
  };
}