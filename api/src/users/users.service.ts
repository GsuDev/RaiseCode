import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateBulkGenericUsersDto, GeneratedUserCredentials } from './dto/create-bulk-generic-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private jwtService : JwtService) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Valida que las contraseñas coincidan, que el email no esté en uso,
   * hashea la contraseña y asigna el rol USER por defecto.
   */
  async createUser(createUserDto: CreateUserDto) {
    const { name, lastname, email, password, passwordConfirm, courseId } =
      createUserDto;

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
        name,
        lastname,
        email,
        password: hashedPassword,
        courseId,
      },
    });

    // Asignar el rol USER por defecto
    await this.assignDefaultRole(user.id);

    return user;
  }

  /**
   * Valida las credenciales del usuario y devuelve el usuario con sus roles.
   * Lanza UnauthorizedException si el email no existe o la contraseña no coincide.
   */
  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar el usuario incluyendo sus roles para el token
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    // Mismo mensaje para email y contraseña incorrectos — no dar pistas
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Comparar contraseña en texto plano con el hash almacenado
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

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
   * Busca un usuario por id incluyendo sus roles y el curso.
   * Lanza excepción si no existe.
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        // Añadimos el include de course para que se vea en el perfil
        course: {
          select: {
            id: true,
            name: true,
          },
        },
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

  /**
   * Busca un todos los usuarios.
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          lastname: true,
          email: true,
          password: false,
          userRoles: {
            include: {
              role: true
            }
          },
          course: {
            select: {
              name: true,
            }
          }
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.challenge.count(),
    ]);

    // Transformar la salida para que roles sea un array de strings
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      roles: user.userRoles.map(ur => ur.role.name),
      course: user.course,
    }));

    return {
      data: formattedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }
  }

  /**
  * Busca el perfil del usuario.
  */
async findProfile(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      course: {
        select: { id: true, name: true },
      },
      userRoles: {
        include: { role: true },
      },
      completedChallenges: {
        include: {
          challenge: {
            include: { language: true, dificulty: true },
          },
        },
        orderBy: { completedAt: 'desc' },
      },
    },
  });

  if (!user) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }

  const times = user.completedChallenges
      .map((cc) => Number(cc.time))
      .filter((t) => t > 0);

  const avgExecutionTime = times.length > 0
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : null;

  const bestExecutionTime = times.length > 0
      ? Math.min(...times)
      : null;

  const xpMap: Record<string, number> = { Easy: 10, Medium: 25, Hard: 50 };

  const languageStats = user.completedChallenges.reduce((acc: any, curr: any) => {
    const lang = curr.challenge.language;
    if (lang) {
      if (!acc[lang.id]) {
        acc[lang.id] = { languageName: lang.name, count: 0 };
      }
      acc[lang.id].count += 1;
    }
    return acc;
  }, {});

  const recentActivity = user.completedChallenges.map((cc) => ({
    challengeId: cc.challengeId,
    challengeTitle: cc.challenge.title,
    languageName: cc.challenge.language.name,
    executionTime: Number(cc.time),
    completedAt: cc.completedAt.toISOString(),
    xpEarned: xpMap[cc.challenge.dificulty.name] ?? 10,
  }));

  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    xp: user.xp,
    course: user.course,
    roles: user.userRoles.map(ur => ur.role.name),
    stats: {
      completedCount: user.completedChallenges.length,
      byLanguage: Object.values(languageStats),
      avgExecutionTime,
      bestExecutionTime,
    },
    recentActivity,
  };
}

  /**
  * Actualiza los datos de un usuario.
  */
  async update(id : number,  updateUserDto : UpdateUserDto) {
    this.findOne(id)

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select : {
        id : true,
        name: true,
        lastname: true,
        email: true,
        password: false,
        userRoles: {
          include: {
            role: true
          }
        }
    }});

    return updated
  }

  /**
  * Eliminia un usuario.
  */
  async remove(id : number, userId : number) {
    this.findOne(id)

    if (userId === id) {
      throw new NotAcceptableException(`No puede borrarse a si mismo`);
    }

    await this.prisma.userRoles.deleteMany({ where: { userId: id } });
    await this.prisma.userAchievements.deleteMany({ where: { userId: id } });
    await this.prisma.userSubjects.deleteMany({ where: { userId: id } });
    await this.prisma.completedChallenges.deleteMany({ where: { userId: id } });

    const deleted = await this.prisma.user.delete({
      where : {id}
    })

    return deleted
  }

  /**
   * Genera un lote de usuarios genéricos con credenciales auto-generadas
   * Las contraseñas se devuelven en claro una única vez
   */
  async createBulkGenericUsers(
    bulkDto: CreateBulkGenericUsersDto,
  ): Promise<GeneratedUserCredentials[]> {
    const { prefix, count } = bulkDto;

    // Obtener el primer curso disponible como curso por defecto
    const defaultCourse = await this.prisma.course.findFirst();
    if (!defaultCourse) {
      throw new BadRequestException('No hay cursos disponibles para asignar a los usuarios');
    }

    // Obtener el rol USER
    const userRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });
    if (!userRole) {
      throw new BadRequestException('No existe el rol USER en la base de datos');
    }

    const generatedCredentials: GeneratedUserCredentials[] = [];

    for (let i = 1; i <= count; i++) {
      // Generar username con ceros a la izquierda si es necesario
      const paddingLength = count <= 99 ? 2 : count <= 999 ? 3 : 4;
      const username = `${prefix}${String(i).padStart(paddingLength, '0')}`;
      
      // Email ficticio no contactable
      const email = `${username}@raisecode.local`;
      
      // Contraseña aleatoria de 10 caracteres (letras + números)
      const password = this.generateRandomPassword(10);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      await this.prisma.user.create({
        data: {
          name: 'Alumno',
          lastname: `${prefix}${i}`,
          email,
          password: hashedPassword,
          courseId: defaultCourse.id,
          userRoles: {
            create: {
              roleId: userRole.id,
            },
          },
        },
      });

      // Guardar credenciales en claro para devolverlas
      generatedCredentials.push({
        email,
        password,
      });
    }

    return generatedCredentials;
  }

  /**
   * Genera una contraseña aleatoria con letras y números
   */
  private generateRandomPassword(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
