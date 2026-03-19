import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { ExecutionGateway } from './execution.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Para JwtAuthGuard en el controller
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, ExecutionGateway],
})
export class ExecutionModule {}
