import { z } from 'zod';

export const addFavoriteSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la canción es obligatorio'),
  artist: z
    .string()
    .min(1, 'El nombre del artista es obligatorio'),
  imageUrl: z.string().optional().nullable(),
  mbid: z.string().optional().nullable(),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
