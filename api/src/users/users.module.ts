import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController], // Exportamos el servicio para que AuthModule pueda usarlo
})
export class UsersModule {}
