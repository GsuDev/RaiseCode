import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DifficultiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todas las dificultades disponibles.
   * Usado por el formulario de creación de retos.
   */
  async findAll() {
    return this.prisma.dificulty.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' }, // Easy → Medium → Hard
    });
  }
}
