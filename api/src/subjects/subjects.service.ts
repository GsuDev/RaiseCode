import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
