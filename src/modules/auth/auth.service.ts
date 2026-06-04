import { prisma } from '../../database/client';
import { hashPassword } from '../../core/utils/hash';
import { RegisterInput } from './auth.validation';

export class AuthService {
  async register(input: RegisterInput) {
    // 1. Verificar si el correo ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      const error = new Error('El correo electrónico ya está registrado');
      (error as any).statusCode = 409;
      throw error;
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await hashPassword(input.password);

    // 3. Crear el nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        photo: input.photo,
      },
    });

    // 4. Retornar el usuario sin la contraseña
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
