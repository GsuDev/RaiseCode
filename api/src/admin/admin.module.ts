import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
     imports: [AuthModule, PrismaModule],
      providers: [AdminService],
      exports: [AdminService],
      controllers: [AdminController],
})
export class AdminModule {}
