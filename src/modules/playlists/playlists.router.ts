import { Router, Response, NextFunction } from 'express';
import { PlaylistsService } from './playlists.service';
import { createPlaylistSchema, updatePlaylistSchema, addTrackSchema } from './playlists.validation';
import { validateBody } from '../../core/middlewares/validation.middleware';
import { authMiddleware, AuthenticatedRequest } from '../../core/middlewares/auth.middleware';

const router = Router();
const playlistsService = new PlaylistsService();

// Todas las rutas en este router requieren autenticación
router.use(authMiddleware as any);

// ➔ Crear playlist
router.post(
  '/',
  validateBody(createPlaylistSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const playlist = await playlistsService.createPlaylist(userId, req.body);
      res.status(201).json({
        message: 'Playlist creada con éxito',
        playlist,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Obtener todas las playlists del usuario
router.get(
  '/',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const playlists = await playlistsService.getUserPlaylists(userId);
      res.status(200).json(playlists);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Obtener detalle de una playlist
router.get(
  '/:id',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const playlist = await playlistsService.getPlaylistById(userId, req.params.id as string);
      res.status(200).json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Editar playlist
router.put(
  '/:id',
  validateBody(updatePlaylistSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const playlist = await playlistsService.updatePlaylist(userId, req.params.id as string, req.body);
      res.status(200).json({
        message: 'Playlist actualizada con éxito',
        playlist,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Eliminar playlist
router.delete(
  '/:id',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await playlistsService.deletePlaylist(userId, req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Agregar canción a playlist
router.post(
  '/:id/tracks',
  validateBody(addTrackSchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const track = await playlistsService.addTrackToPlaylist(userId, req.params.id as string, req.body);
      res.status(201).json({
        message: 'Canción agregada con éxito',
        track,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ➔ Quitar canción de playlist
router.delete(
  '/:id/tracks/:trackId',
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await playlistsService.removeTrackFromPlaylist(userId, req.params.id as string, req.params.trackId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
