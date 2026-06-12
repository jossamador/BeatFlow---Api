import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .optional(),
  photo: z
    .string()
    .url('La foto debe ser una URL válida')
    .max(500, 'La URL de la foto no puede exceder los 500 caracteres')
    .optional()
    .nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
