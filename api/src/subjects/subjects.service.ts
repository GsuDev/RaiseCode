import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const subjects = await this.prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        subjectCourses: {
          select: { course: { select: { id: true, name: true } } },
        },
        _count: { select: { challenges: true } },
      },
      orderBy: { name: 'asc' },
    });

    return subjects.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      courses: s.subjectCourses.map((sc) => sc.course),
      challengeCount: s._count.challenges,
    }));
  }

  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        subjectCourses: {
          select: { course: { select: { id: true, name: true } } },
        },
      },
    });

    if (!subject) throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);

    const [total, easy, medium, hard] = await Promise.all([
      this.prisma.challenge.count({ where: { subjectId: id, validate: true } }),
      this.prisma.challenge.count({ where: { subjectId: id, validate: true, dificulty: { name: 'Easy' } } }),
      this.prisma.challenge.count({ where: { subjectId: id, validate: true, dificulty: { name: 'Medium' } } }),
      this.prisma.challenge.count({ where: { subjectId: id, validate: true, dificulty: { name: 'Hard' } } }),
    ]);

    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      courses: subject.subjectCourses.map((sc) => sc.course),
      stats: { total, easy, medium, hard },
    };
  }

  async create(dto: CreateSubjectDto) {
    const subject = await this.prisma.subject.create({
      data: {
        name: dto.name,
        description: dto.description ?? '',
        subjectCourses: { create: dto.courseIds.map((courseId) => ({ courseId })) },
      },
      select: {
        id: true,
        name: true,
        description: true,
        subjectCourses: { select: { course: { select: { id: true, name: true } } } },
        _count: { select: { challenges: true } },
      },
    });

    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      courses: subject.subjectCourses.map((sc) => sc.course),
      challengeCount: subject._count.challenges,
    };
  }

  async update(id: number, dto: UpdateSubjectDto) {
    const existing = await this.prisma.subject.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);

    await this.prisma.$transaction(async (tx) => {
      await tx.subject.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
        },
      });

      if (dto.courseIds !== undefined) {
        // Reemplazamos todos los ciclos de golpe para simplificar la lógica de sincronización
        await tx.subjectCourse.deleteMany({ where: { subjectId: id } });
        await tx.subjectCourse.createMany({
          data: dto.courseIds.map((courseId) => ({ subjectId: id, courseId })),
        });
      }
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    // Bloqueamos el borrado si hay retos asociados para no dejar huérfanos en la BD
    const challengeCount = await this.prisma.challenge.count({ where: { subjectId: id } });
    if (challengeCount > 0) {
      throw new BadRequestException('No se puede eliminar una asignatura con retos asociados');
    }

    // Primero eliminamos las relaciones de la tabla intermedia, luego la asignatura
    await this.prisma.$transaction(async (tx) => {
      await tx.subjectCourse.deleteMany({ where: { subjectId: id } });
      await tx.subject.delete({ where: { id } });
    });
  }

  async findChallengesBySubject(id: number, page: number, limit: number) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.challenge.findMany({
        where: { subjectId: id, validate: true },
        select: {
          id: true,
          title: true,
          description: true,
          dificulty: { select: { id: true, name: true } },
          language: { select: { id: true, name: true } },
          _count: { select: { completedChallenges: true } },
        },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.challenge.count({ where: { subjectId: id, validate: true } }),
    ]);

    return {
      data: data.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        dificulty: c.dificulty,
        language: c.language,
        completedCount: c._count.completedChallenges,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
