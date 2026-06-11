import { prisma } from '../../database/client';
import { LogPlayInput } from './analytics.validation';

export class AnalyticsService {
  async logPlay(userId: string, input: LogPlayInput) {
    return prisma.listeningHistory.create({
      data: {
        userId,
        trackName: input.trackName,
        artistName: input.artistName,
        duration: input.duration,
      },
    });
  }

  async getListeningStats(userId: string) {
    const aggregation = await prisma.listeningHistory.aggregate({
      where: { userId },
      _sum: {
        duration: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalListeningTime: aggregation._sum.duration || 0, // Suma de segundos
      totalPlays: aggregation._count.id || 0,           // Cantidad total de reproducciones
    };
  }

  async getTopArtists(userId: string, limit: number = 10) {
    const grouped = await prisma.listeningHistory.groupBy({
      by: ['artistName'],
      where: { userId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    // Mapear los resultados al formato estándar esperado por las gráficas del frontend
    return grouped.map((item) => ({
      artist: item.artistName,
      plays: item._count.id,
    }));
  }
}
