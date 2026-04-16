import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { ExecutionGateway } from './execution.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AchievementsModule } from 'src/achievements/achievements.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Para JwtAuthGuard en el controller,
    AchievementsModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, ExecutionGateway],
})
export class ExecutionModule {}
