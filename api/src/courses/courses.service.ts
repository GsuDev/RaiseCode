import { Injectable } from '@nestjs/common';
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
}