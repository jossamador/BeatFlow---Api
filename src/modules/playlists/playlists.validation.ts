import { z } from 'zod';

export const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la playlist es obligatorio y no puede estar vacío')
    .max(100, 'El nombre de la playlist no puede exceder los 100 caracteres'),
  description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres').optional().nullable(),
});

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;

export const updatePlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la playlist no puede estar vacío')
    .max(100, 'El nombre de la playlist no puede exceder los 100 caracteres')
    .optional(),
  description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres').optional().nullable(),
});

export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;

export const addTrackSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la canción es obligatorio'),
  artist: z
    .string()
    .min(1, 'El nombre del artista es obligatorio'),
  imageUrl: z.string().optional().nullable(),
  mbid: z.string().optional().nullable(),
});

export type AddTrackInput = z.infer<typeof addTrackSchema>;
