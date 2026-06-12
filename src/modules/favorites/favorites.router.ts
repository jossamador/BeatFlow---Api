import { Router, Response, NextFunction } from 'express';
import { FavoritesService } from './favorites.service';
import { addFavoriteSchema } from './favorites.validation';
import { validateBody } from '../../core/middlewares/validation.middleware';
import { authMiddleware, AuthenticatedRequest } from '../../core/middlewares/auth.middleware';

const router = Router();
const favoritesService = new FavoritesService();

// Todas las rutas requieren autenticación
router.use(authMiddleware as any);

// ➔ Obtener todas las canciones favoritas del usuario
router.get(
  '/',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const favorites = await favoritesService.getUserFavorites(userId);
      res.status(200).json(favorites);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Agregar canción a favoritos
router.post(
  '/',
  validateBody(addFavoriteSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const favorite = await favoritesService.addFavorite(userId, req.body);
      res.status(201).json({
        message: 'Canción guardada en favoritos con éxito',
        favorite,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Verificar si una canción es favorita
router.get(
  '/check',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { name, artist } = req.query;

      if (!name || !artist) {
        res.status(400).json({ message: 'Los parámetros name y artist son requeridos' });
        return;
      }

      const result = await favoritesService.checkIsFavorite(
        userId,
        name as string,
        artist as string
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Eliminar canción de favoritos por ID
router.delete(
  '/:id',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await favoritesService.removeFavorite(userId, req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
