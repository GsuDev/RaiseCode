import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todos los cursos (ciclos formativos) disponibles.
   * Usado por el formulario de creación de retos y de registro.
   */
  async findAll() {
  return this.prisma.course.findMany({ 
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  }

  /**
   * Devuelve todos los cursos con el numero de asignaturas asociadas,
   * usado por el panel de admin
   */
  async findAllAdmin() {
  const courses = await this.prisma.course.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { subjectCourses: true } },
    },
    orderBy: { name: 'asc' },
  });

  return courses.map((c) => ({
    id: c.id,
    name: c.name,
    subjectCount: c._count.subjectCourses,
  }));
}

/**
 * Crea un nuevo ciclo formativo.
 */
async create(name: string) {
  return this.prisma.course.create({
    data: { name },
    select: { id: true, name: true },
  });
}

/**
 * Edita el nombre de un ciclo formativo.
 */
async update(id: number, name: string) {
  return this.prisma.course.update({
    where: { id },
    data: { name },
    select: { id: true, name: true },
  });
}

/**
 * Elimina un ciclo formativo.
 * lanza 400 si tiene asignaturas asociadas.
 */
async remove(id: number) {
  const course = await this.prisma.course.findUnique({
    where: { id },
    include: { _count: { select: { subjectCourses: true } } },
  });

  if (!course) {
    throw new NotFoundException(`Ciclo con ID ${id} no encontrado`);
  }

  if (course._count.subjectCourses > 0) {
    throw new BadRequestException('No se puede eliminar un ciclo con asignaturas asociadas');
  }

  await this.prisma.course.delete({ where: { id } });

  return { message: `Ciclo con ID ${id} eliminado correctamente` };
}
}