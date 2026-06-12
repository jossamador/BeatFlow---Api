import { prisma } from '../../database/client';
import { UpdateProfileInput } from './profile.validation';

export class ProfileService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      (error as any).statusCode = 404;
      throw error;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    // Verificar que el usuario exista
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      (error as any).statusCode = 404;
      throw error;
    }

    // Actualizar campos que vengan definidos en el payload
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name !== undefined ? input.name : undefined,
        photo: input.photo !== undefined ? input.photo : undefined,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
