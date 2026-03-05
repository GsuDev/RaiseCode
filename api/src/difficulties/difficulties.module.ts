import { Module } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';
import { DifficultiesController } from './difficulties.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DifficultiesController],
  providers: [DifficultiesService],
})
export class DifficultiesModule {}
