import { Router, Request, Response, NextFunction } from 'express';
import { ExploreService } from './explore.service';

const router = Router();
const exploreService = new ExploreService();

router.get(
  '/trends',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parsear query params opcionales limit y page
      const limitQuery = req.query.limit;
      const pageQuery = req.query.page;

      const limit = limitQuery ? parseInt(limitQuery as string, 10) : 50;
      const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;

      // Validaciones básicas de parámetros numéricos
      if (isNaN(limit) || limit <= 0) {
        const error = new Error('El parámetro limit debe ser un número entero positivo');
        (error as any).statusCode = 400;
        throw error;
      }

      if (isNaN(page) || page <= 0) {
        const error = new Error('El parámetro page debe ser un número entero positivo');
        (error as any).statusCode = 400;
        throw error;
      }

      const tracks = await exploreService.getTopTracks(limit, page);
      res.status(200).json(tracks);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
