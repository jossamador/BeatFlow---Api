import { prisma } from '../../database/client';
import { AddFavoriteInput } from './favorites.validation';

export class FavoritesService {
  async addFavorite(userId: string, input: AddFavoriteInput) {
    // Verificar si ya existe para evitar duplicados y errores de índice único
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_name_artist: {
          userId,
          name: input.name,
          artist: input.artist,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.favorite.create({
      data: {
        userId,
        name: input.name,
        artist: input.artist,
        imageUrl: input.imageUrl,
        mbid: input.mbid,
      },
    });
  }

  async getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeFavorite(userId: string, id: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      const error = new Error('Canción favorita no encontrada');
      (error as any).statusCode = 404;
      throw error;
    }

    if (favorite.userId !== userId) {
      const error = new Error('No tienes permisos para eliminar este favorito');
      (error as any).statusCode = 403;
      throw error;
    }

    await prisma.favorite.delete({
      where: { id },
    });

    return { message: 'Canción eliminada de favoritos con éxito' };
  }

  async checkIsFavorite(userId: string, name: string, artist: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_name_artist: {
          userId,
          name,
          artist,
        },
      },
    });

    return {
      isFavorite: !!favorite,
      favoriteId: favorite ? favorite.id : null,
    };
  }
}
