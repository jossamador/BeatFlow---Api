import { Router, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { logPlaySchema } from './analytics.validation';
import { validateBody } from '../../core/middlewares/validation.middleware';
import { authMiddleware, AuthenticatedRequest } from '../../core/middlewares/auth.middleware';

const router = Router();
const analyticsService = new AnalyticsService();

// Todas las rutas requieren autenticación
router.use(authMiddleware as any);

// ➔ Registrar una nueva reproducción en el historial
router.post(
  '/history',
  validateBody(logPlaySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const historyEntry = await analyticsService.logPlay(userId, req.body);
      res.status(201).json({
        message: 'Reproducción registrada con éxito',
        historyEntry,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Obtener estadísticas de resumen (tiempo de escucha y total reproducciones)
router.get(
  '/stats/summary',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const stats = await analyticsService.getListeningStats(userId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Obtener los artistas favoritos del usuario para las gráficas
router.get(
  '/stats/top-artists',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const limitQuery = req.query.limit;
      const limit = limitQuery ? parseInt(limitQuery as string, 10) : 10;

      if (isNaN(limit) || limit <= 0) {
        const error = new Error('El parámetro limit debe ser un número entero positivo');
        (error as any).statusCode = 400;
        throw error;
      }

      const topArtists = await analyticsService.getTopArtists(userId, limit);
      res.status(200).json(topArtists);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
