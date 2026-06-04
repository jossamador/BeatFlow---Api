import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('El formato de correo no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener mínimo 8 caracteres'),
  name: z.string().optional(),
  photo: z.string().url('La foto debe ser una URL válida').optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
