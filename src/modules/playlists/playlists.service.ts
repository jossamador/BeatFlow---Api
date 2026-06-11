import { prisma } from '../../database/client';
import { CreatePlaylistInput, UpdatePlaylistInput, AddTrackInput } from './playlists.validation';

export class PlaylistsService {
  async createPlaylist(userId: string, input: CreatePlaylistInput) {
    return prisma.playlist.create({
      data: {
        name: input.name,
        description: input.description,
        userId: userId,
      },
    });
  }

  async getUserPlaylists(userId: string) {
    return prisma.playlist.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tracks: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlaylistById(userId: string, id: string) {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        tracks: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!playlist) {
      const error = new Error('Playlist no encontrada');
      (error as any).statusCode = 404;
      throw error;
    }

    if (playlist.userId !== userId) {
      const error = new Error('No tienes permisos para acceder a esta playlist');
      (error as any).statusCode = 403;
      throw error;
    }

    return playlist;
  }

  async updatePlaylist(userId: string, id: string, input: UpdatePlaylistInput) {
    // Verificar propiedad y existencia
    await this.getPlaylistById(userId, id);

    return prisma.playlist.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
      },
    });
  }

  async deletePlaylist(userId: string, id: string) {
    // Verificar propiedad y existencia
    await this.getPlaylistById(userId, id);

    await prisma.playlist.delete({
      where: { id },
    });

    return { message: 'Playlist eliminada con éxito' };
  }

  async addTrackToPlaylist(userId: string, playlistId: string, input: AddTrackInput) {
    // Verificar propiedad y existencia de la playlist
    await this.getPlaylistById(userId, playlistId);

    return prisma.playlistTrack.create({
      data: {
        playlistId,
        name: input.name,
        artist: input.artist,
        imageUrl: input.imageUrl,
        mbid: input.mbid,
      },
    });
  }

  async removeTrackFromPlaylist(userId: string, playlistId: string, trackId: string) {
    // Verificar propiedad y existencia de la playlist
    await this.getPlaylistById(userId, playlistId);

    const track = await prisma.playlistTrack.findUnique({
      where: { id: trackId },
    });

    if (!track || track.playlistId !== playlistId) {
      const error = new Error('Canción no encontrada en esta playlist');
      (error as any).statusCode = 404;
      throw error;
    }

    await prisma.playlistTrack.delete({
      where: { id: trackId },
    });

    return { message: 'Canción eliminada de la playlist con éxito' };
  }
}
