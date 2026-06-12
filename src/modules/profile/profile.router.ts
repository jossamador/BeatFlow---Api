import { Router, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service';
import { updateProfileSchema } from './profile.validation';
import { validateBody } from '../../core/middlewares/validation.middleware';
import { authMiddleware, AuthenticatedRequest } from '../../core/middlewares/auth.middleware';

const router = Router();
const profileService = new ProfileService();

// Todas las rutas en este router requieren autenticación
router.use(authMiddleware as any);

// ➔ Obtener datos del perfil actual
router.get(
  '/',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await profileService.getProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Actualizar datos del perfil
router.put(
  '/',
  validateBody(updateProfileSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const profile = await profileService.updateProfile(userId, req.body);
      res.status(200).json({
        message: 'Perfil actualizado con éxito',
        user: profile,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
