import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema } from './auth.validation';
import { validateBody } from '../../core/middlewares/validation.middleware';

const router = Router();
const authService = new AuthService();

router.post(
  '/register',
  validateBody(registerSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        message: 'Usuario registrado con éxito',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
