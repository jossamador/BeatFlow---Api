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

  async getTopArtists(limit: number = 50, page: number = 1) {
    if (!this.apiKey) {
      const error = new Error('La clave API de Last.fm no está configurada');
      (error as any).statusCode = 500;
      throw error;
    }

    const url = `${this.apiBaseUrl}?method=chart.gettopartists&api_key=${this.apiKey}&format=json&limit=${limit}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`Error en API externa de Last.fm (Artistas): ${response.statusText}`);
        (error as any).statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as any;

      if (!data.artists || !data.artists.artist) {
        return [];
      }

      return data.artists.artist.map((artist: any, index: number) => {
        const rank = (page - 1) * limit + (index + 1);

        const imageObj = artist.image
          ? artist.image.find((img: any) => img.size === 'extralarge') ||
            artist.image.find((img: any) => img.size === 'large')
          : null;
        const imageUrl = imageObj ? imageObj['#text'] : null;

        return {
          rank,
          name: artist.name,
          imageUrl: imageUrl || '',
          listeners: artist.listeners ? parseInt(artist.listeners, 10) : 0,
          playcount: artist.playcount ? parseInt(artist.playcount, 10) : 0,
          mbid: artist.mbid || null,
        };
      });
    } catch (err: any) {
      console.error('Error al consultar Last.fm Top Artists:', err);
      const error = new Error(err.message || 'Error al obtener artistas populares');
      (error as any).statusCode = err.statusCode || 500;
      throw error;
    }
  }

  async getArtistInfo(artistName: string) {
    if (!this.apiKey) {
      const error = new Error('La clave API de Last.fm no está configurada');
      (error as any).statusCode = 500;
      throw error;
    }

    const url = `${this.apiBaseUrl}?method=artist.getinfo&api_key=${this.apiKey}&format=json&artist=${encodeURIComponent(artistName)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`Error en API externa de Last.fm (Info Artista): ${response.statusText}`);
        (error as any).statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as any;

      if (!data.artist) {
        const error = new Error('Artista no encontrado');
        (error as any).statusCode = 404;
        throw error;
      }

      const artist = data.artist;

      const imageObj = artist.image
        ? artist.image.find((img: any) => img.size === 'extralarge') ||
          artist.image.find((img: any) => img.size === 'large')
        : null;
      const imageUrl = imageObj ? imageObj['#text'] : null;

      return {
        name: artist.name,
        mbid: artist.mbid || null,
        imageUrl: imageUrl || '',
        listeners: artist.stats?.listeners ? parseInt(artist.stats.listeners, 10) : 0,
        playcount: artist.stats?.playcount ? parseInt(artist.stats.playcount, 10) : 0,
        summary: artist.bio?.summary || '',
        content: artist.bio?.content || '',
      };
    } catch (err: any) {
      console.error(`Error al consultar Last.fm info para el artista ${artistName}:`, err);
      const error = new Error(err.message || 'Error al obtener información del artista');
      (error as any).statusCode = err.statusCode || 500;
      throw error;
    }
  }

  async searchTracks(query: string, limit: number = 20, page: number = 1) {
    if (!this.apiKey) {
      const error = new Error('La clave API de Last.fm no está configurada');
      (error as any).statusCode = 500;
      throw error;
    }

    const url = `${this.apiBaseUrl}?method=track.search&api_key=${this.apiKey}&format=json&track=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`Error en API externa de Last.fm (Buscar Canciones): ${response.statusText}`);
        (error as any).statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as any;

      if (!data.results || !data.results.trackmatches || !data.results.trackmatches.track) {
        return [];
      }

      // Last.fm devuelve un arreglo de tracks o un solo track
      const tracks = Array.isArray(data.results.trackmatches.track)
        ? data.results.trackmatches.track
        : [data.results.trackmatches.track];

      return tracks.map((track: any) => {
        const imageObj = track.image
          ? track.image.find((img: any) => img.size === 'extralarge') ||
            track.image.find((img: any) => img.size === 'large')
          : null;
        const imageUrl = imageObj ? imageObj['#text'] : null;

        return {
          name: track.name,
          artist: track.artist || 'Unknown Artist',
          imageUrl: imageUrl || '',
          listeners: track.listeners ? parseInt(track.listeners, 10) : 0,
          mbid: track.mbid || null,
        };
      });
    } catch (err: any) {
      console.error(`Error al buscar canciones con la consulta "${query}":`, err);
      const error = new Error(err.message || 'Error al buscar canciones');
      (error as any).statusCode = err.statusCode || 500;
      throw error;
    }
  }

  async searchArtists(query: string, limit: number = 20, page: number = 1) {
    if (!this.apiKey) {
      const error = new Error('La clave API de Last.fm no está configurada');
      (error as any).statusCode = 500;
      throw error;
    }

    const url = `${this.apiBaseUrl}?method=artist.search&api_key=${this.apiKey}&format=json&artist=${encodeURIComponent(query)}&limit=${limit}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`Error en API externa de Last.fm (Buscar Artistas): ${response.statusText}`);
        (error as any).statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as any;

      if (!data.results || !data.results.artistmatches || !data.results.artistmatches.artist) {
        return [];
      }

      const artists = Array.isArray(data.results.artistmatches.artist)
        ? data.results.artistmatches.artist
        : [data.results.artistmatches.artist];

      return artists.map((artist: any) => {
        const imageObj = artist.image
          ? artist.image.find((img: any) => img.size === 'extralarge') ||
            artist.image.find((img: any) => img.size === 'large')
          : null;
        const imageUrl = imageObj ? imageObj['#text'] : null;

        return {
          name: artist.name,
          imageUrl: imageUrl || '',
          listeners: artist.listeners ? parseInt(artist.listeners, 10) : 0,
          mbid: artist.mbid || null,
        };
      });
    } catch (err: any) {
      console.error(`Error al buscar artistas con la consulta "${query}":`, err);
      const error = new Error(err.message || 'Error al buscar artistas');
      (error as any).statusCode = err.statusCode || 500;
      throw error;
    }
  }

  private readonly MOODS = [
    {
      id: 'happy',
      name: 'Feliz',
      emoji: '😊',
      description: 'Canciones alegres para subir el ánimo y llenarte de energía positiva.',
      color: 'linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)',
      tag: 'happy',
    },
    {
      id: 'sad',
      name: 'Triste',
      emoji: '😢',
      description: 'Melodías melancólicas y reflexivas ideales para momentos íntimos.',
      color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
      tag: 'sad',
    },
    {
      id: 'chill',
      name: 'Relajado',
      emoji: '🍃',
      description: 'Música ambiental y relajante para desconectar del estrés diario.',
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      tag: 'chillout',
    },
    {
      id: 'energetic',
      name: 'Enérgico',
      emoji: '⚡',
      description: 'Sonidos potentes y ritmos rápidos para motivarte al máximo.',
      color: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
      tag: 'energetic',
    },
    {
      id: 'focus',
      name: 'Concentración',
      emoji: '🧠',
      description: 'Pistas instrumentales y tranquilas para estudiar o trabajar.',
      color: 'linear-gradient(135deg, #70A1FF 0%, #1E90FF 100%)',
      tag: 'ambient',
    },
    {
      id: 'party',
      name: 'Fiesta',
      emoji: '🎉',
      description: 'Los mejores ritmos de club y baile para encender la pista.',
      color: 'linear-gradient(135deg, #F857A6 0%, #FF5858 100%)',
      tag: 'party',
    }
  ];

  getMoodCategories() {
    return this.MOODS.map(({ id, name, emoji, description, color }) => ({
      id,
      name,
      emoji,
      description,
      color,
    }));
  }

  getMoodById(id: string) {
    return this.MOODS.find(m => m.id === id) || null;
  }

  async getTracksByMood(tag: string, limit: number = 30, page: number = 1) {
    if (!this.apiKey) {
      const error = new Error('La clave API de Last.fm no está configurada');
      (error as any).statusCode = 500;
      throw error;
    }

    const url = `${this.apiBaseUrl}?method=tag.gettoptracks&api_key=${this.apiKey}&format=json&tag=${encodeURIComponent(tag)}&limit=${limit}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`Error en API externa de Last.fm (Moods): ${response.statusText}`);
        (error as any).statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as any;

      if (!data.tracks || !data.tracks.track) {
        return [];
      }

      const tracks = Array.isArray(data.tracks.track)
        ? data.tracks.track
        : [data.tracks.track];

      return tracks.map((track: any, index: number) => {
        const rank = (page - 1) * limit + (index + 1);
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
          mbid: track.mbid || null,
        };
      });
    } catch (err: any) {
      console.error(`Error al obtener canciones para el mood (tag: ${tag}):`, err);
      const error = new Error(err.message || 'Error al obtener canciones por mood');
      (error as any).statusCode = err.statusCode || 500;
      throw error;
    }
  }
}

