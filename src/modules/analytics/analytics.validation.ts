import { z } from 'zod';

export const logPlaySchema = z.object({
  trackName: z
    .string()
    .min(1, 'El nombre de la canción es obligatorio'),
  artistName: z
    .string()
    .min(1, 'El nombre del artista es obligatorio'),
  duration: z
    .number()
    .int('La duración debe ser un número entero')
    .positive('La duración debe ser mayor a 0 segundos'),
});

export type LogPlayInput = z.infer<typeof logPlaySchema>;
