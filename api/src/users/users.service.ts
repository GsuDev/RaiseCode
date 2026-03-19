import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private jwtService : JwtService) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * Valida que las contraseñas coincidan, que el email no esté en uso,
   * hashea la contraseña y asigna el rol USER por defecto.
   */
  async createUser(createUserDto: CreateUserDto) {
    const { nombre, apellidos, email, password, passwordConfirm, cycle } =
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
  async findProfile(id : number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        password: false,
        cycle : true,
        userRoles: {
          include: {
            role: true
          }
        },
        completedChallenges: {
          include: {
            challenge: {
              // Asumiendo que Challenge tiene un 'title' y una relación con 'Language'
              include: { language: true }, 
            },
          }
        } 
      }});

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    
    const languageStats = user.completedChallenges.reduce((acc: any, curr: any) => {
      const lang = curr.challenge.language; 
      
      if (lang) {
        if (!acc[lang.id]) {
          acc[lang.id] = { languageId: lang.id, languageName: lang.name, count: 0 };
        }
        acc[lang.id].count += 1;
      }
      return acc;
    }, {});

    const recentActivity = user.completedChallenges.map((cc) => ({
      challengeId: cc.challengeId,
      challengeTitle: cc.challenge.title,
      languageName: cc.challenge.language.name,
      time: Number(cc.time), 
    }));

    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      cycle: user.cycle,
      roles: user.userRoles.map(ur => ur.role.name),
      stats: {
        completedCount: user.completedChallenges.length,
        byLanguage: Object.values(languageStats),
      },
      // Puedes usar .slice(0, 5) si solo quieres los 5 más recientes
      recentActivity: recentActivity, 
    };
  }
}
