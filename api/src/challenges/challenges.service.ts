import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

// Formato de respuesta limpio que coincide con el mock del front
const challengeSelect = {
  id: true,
  title: true,
  description: true,
  statement: true,
  dificulty: { select: { id: true, name: true } },
  language: { select: { id: true, name: true } },
  subject: { select: { id: true, name: true } },
};

// Mapea el resultado crudo de Prisma al formato esperado por el front
function mapChallenge(challenge: any) {
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    statement: challenge.statement,
    dificulty: challenge.dificulty,
    language: challenge.language,
    subject: challenge.subject,
    completedCount: challenge._count?.completedChallenges ?? 0,
  };
}

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Crea un nuevo reto. El creatorId se extrae del token JWT.
   * validate arranca como false por defecto (pendiente de validación por admin).
   */
  async create(dto: CreateChallengeDto, creatorId: number) {
    const challenge = await this.prisma.challenge.create({
      data: {
        title: dto.title,
        description: dto.description,
        statement: dto.statement,
        dificultyId: dto.dificultyId,
        languageId: dto.languageId,
        subjectId: dto.subjectId,
        creatorId,
        validatorId: creatorId, // Requerido por el schema — el admin lo actualizará con PATCH
        validate: dto.validate ?? false,
      },
      select: {
        ...challengeSelect,
        _count: { select: { completedChallenges: true } },
      },
    });

    return mapChallenge(challenge);
  }

  /**
   * Devuelve todos los retos con paginación.
   * Query params: page (default 1) y limit (default 10).
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [challenges, total] = await this.prisma.$transaction([
      this.prisma.challenge.findMany({
        skip,
        take: limit,
        select: {
          ...challengeSelect,
          _count: { select: { completedChallenges: true } },
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.challenge.count(),
    ]);

    return {
      data: challenges.map(mapChallenge),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Devuelve un reto por id incluyendo tests públicos y completedCount.
   * Lanza 404 si no existe.
   */
  async findOne(id: number) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        creator: {
          select: { name: true, lastname: true },
        },
        dificulty: true,
        language: true,
        subject: true,
        tests: {
          select: { id: true, input: true, expectedOutput: true, hidden: true },
          orderBy: { id: 'asc' },
        },
        _count: {
          select: { completedChallenges: true },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException(`Reto con ID ${id} no encontrado`);
    }

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      statement: challenge.statement,
      dificulty: challenge.dificulty,
      language: challenge.language,
      subject: challenge.subject,
      creatorName: `${challenge.creator.name} ${challenge.creator.lastname}`,
      completedCount: challenge._count.completedChallenges,
      tests: challenge.tests,
    };
  }

  /**
   * Devuelve los 5 retos validados más completados, calculado dinámicamente.
   */
  async findFeatured() {
    const challenges = await this.prisma.challenge.findMany({
      where: { validate: true },
      take: 5,
      orderBy: {
        completedChallenges: { _count: 'desc' },
      },
      select: {
        ...challengeSelect,
        _count: { select: { completedChallenges: true } },
      },
    });

    return challenges.map(mapChallenge);
  }

  /**
   * Actualiza un reto. Solo accesible por admins (controlado en el controller con @Roles).
   */
  async update(id: number, dto: UpdateChallengeDto) {
    await this.findOne(id); // Lanza 404 si no existe

    const updated = await this.prisma.challenge.update({
      where: { id },
      data: dto,
      select: {
        ...challengeSelect,
        _count: { select: { completedChallenges: true } },
      },
    });

    return mapChallenge(updated);
  }

  /**
   * Elimina un reto. Solo accesible por admins (controlado en el controller con @Roles).
   */
  async remove(id: number) {
    await this.findOne(id); // Lanza 404 si no existe

    await this.prisma.challenge.delete({ where: { id } });

    return { message: `Reto con ID ${id} eliminado correctamente` };
  }

  /**
   * Método para obtener retos pendientes
   */
  async findPending() {
    return this.prisma.challenge.findMany({
      where: { validate: false },
      include: {
        subject: true,
        dificulty: true,
        language: true,
        creator: {
          select: {
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  /**
   * Método para validar (aprobar/rechazar)
   */
  async validate(id: number, approved: boolean, adminId: number) {
    return this.prisma.challenge.update({
      where: { id },
      data: {
        validate: approved,
        validatorId: adminId // Asignamos el ID del admin que realiza la acción
      },
    });
  }
}
