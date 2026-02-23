import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Valida que las contraseñas coincidan, que el email no esté en uso,
   * hashea la contraseña y asigna el rol USER por defecto.
   */
  async createUser(createUserDto: CreateUserDto) {
    const { nombre, apellidos, email, password, passwordConfirm, cycle } = createUserDto;

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar que el email no esté registrado previamente
    const existingUser = await this.findEmail(email);
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña antes de persistirla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en base de datos
    const user = await this.prisma.user.create({
      data: {
        name: nombre,
        lastname: apellidos,
        email,
        password: hashedPassword,
        cycle,
      },
    });

    // Asignar el rol USER por defecto
    await this.assignDefaultRole(user.id);

    return user;
  }

  /**
   * Busca un usuario por su email.
   * Devuelve null si no existe (igual que hace el profe con findEmail).
   */
  async findEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Asigna el rol USER al usuario recién creado.
   * Si el rol USER no existe en la base de datos, lo crea automáticamente.
   */
  async assignDefaultRole(userId: number) {
    // Buscar el rol USER o crearlo si no existe
    let userRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });

    if (!userRole) {
      userRole = await this.prisma.role.create({
        data: { name: 'USER' },
      });
    }

    // Relacionar el usuario con el rol en la tabla intermedia
    await this.prisma.userRoles.create({
      data: {
        userId,
        roleId: userRole.id,
      },
    });
  }

  /**
   * Busca un usuario por id incluyendo sus roles.
   * Lanza excepción si no existe.
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }
}
