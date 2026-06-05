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

router.get(
  '/artists/trends',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limitQuery = req.query.limit;
      const pageQuery = req.query.page;

      const limit = limitQuery ? parseInt(limitQuery as string, 10) : 50;
      const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;

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

      const artists = await exploreService.getTopArtists(limit, page);
      res.status(200).json(artists);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/artists/detail',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const artist = req.query.artist;

      if (!artist || typeof artist !== 'string' || artist.trim() === '') {
        const error = new Error('El parámetro artist (nombre del artista) es obligatorio');
        (error as any).statusCode = 400;
        throw error;
      }

      const artistInfo = await exploreService.getArtistInfo(artist);
      res.status(200).json(artistInfo);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = req.query.q;
      const type = req.query.type || 'all';
      const limitQuery = req.query.limit;
      const pageQuery = req.query.page;

      const limit = limitQuery ? parseInt(limitQuery as string, 10) : 20;
      const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;

      if (!q || typeof q !== 'string' || q.trim() === '') {
        const error = new Error('El parámetro q (búsqueda) es obligatorio');
        (error as any).statusCode = 400;
        throw error;
      }

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

      if (type !== 'track' && type !== 'artist' && type !== 'all') {
        const error = new Error('El parámetro type debe ser "track", "artist" o "all"');
        (error as any).statusCode = 400;
        throw error;
      }

      if (type === 'track') {
        const tracks = await exploreService.searchTracks(q, limit, page);
        res.status(200).json(tracks);
        return;
      }

      if (type === 'artist') {
        const artists = await exploreService.searchArtists(q, limit, page);
        res.status(200).json(artists);
        return;
      }

      // type === 'all'
      const [tracks, artists] = await Promise.all([
        exploreService.searchTracks(q, limit, page),
        exploreService.searchArtists(q, limit, page),
      ]);

      res.status(200).json({
        tracks,
        artists,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
