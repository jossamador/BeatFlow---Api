export class ExploreService {
  private apiKey = process.env.lastfmApiKey;
  private apiBaseUrl = 'http://ws.audioscrobbler.com/2.0/';

  async getTopTracks(limit: number = 50, page: number = 1) {
    if (!this.apiKey) {
      const error = new Error('La clave API de Last.fm no está configurada');
      (error as any).statusCode = 500;
      throw error;
    }

    const url = `${this.apiBaseUrl}?method=chart.gettoptracks&api_key=${this.apiKey}&format=json&limit=${limit}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`Error en API externa de Last.fm: ${response.statusText}`);
        (error as any).statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as any;
      
      if (!data.tracks || !data.tracks.track) {
        return [];
      }

      // Mapear los datos de Last.fm al formato de Beatflow
      return data.tracks.track.map((track: any, index: number) => {
        // Calcular la posición global
        const rank = (page - 1) * limit + (index + 1);
        
        // Obtener la portada de tamaño extralarge o large
        const imageObj = track.image
          ? track.image.find((img: any) => img.size === 'extralarge') ||
            track.image.find((img: any) => img.size === 'large')
          : null;
        const imageUrl = imageObj ? imageObj['#text'] : null;

        return {
          rank,
          name: track.name,
          artist: track.artist ? track.artist.name : 'Unknown Artist',
          imageUrl: imageUrl || '',
          listeners: track.listeners ? parseInt(track.listeners, 10) : 0,
          playcount: track.playcount ? parseInt(track.playcount, 10) : 0,
          mbid: track.mbid || null,
        };
      });
    } catch (err: any) {
      console.error('Error al consultar Last.fm Top Tracks:', err);
      const error = new Error(err.message || 'Error al obtener canciones en tendencia');
      (error as any).statusCode = err.statusCode || 500;
      throw error;
    }
  }
}
