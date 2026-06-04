import jwt from 'jsonwebtoken';
import { prisma } from '../../database/client';
import { hashPassword, comparePassword } from '../../core/utils/hash';
import { RegisterInput, LoginInput } from './auth.validation';

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

  async login(input: LoginInput) {
    // 1. Buscar al usuario por correo
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      const error = new Error('Credenciales incorrectas');
      (error as any).statusCode = 401;
      throw error;
    }

    // 2. Verificar la contraseña
    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Credenciales incorrectas');
      (error as any).statusCode = 401;
      throw error;
    }

    // 3. Generar el token JWT
    const jwtSecret = process.env.JWT_SECRET || 'beatflow_super_secret_token_key';
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // 4. Retornar token y datos de usuario sin contraseña
    const { password, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword,
    };
  }
}
