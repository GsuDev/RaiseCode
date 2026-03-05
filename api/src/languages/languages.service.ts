import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Devuelve todos los lenguajes disponibles.
   * Usado por el formulario de creación de retos.
   */
  async findAll() {
    return this.prisma.language.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
