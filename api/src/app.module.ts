import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseService } from './mongoose/mongoose.service';
import { MongooseModule } from './mongoose/mongoose.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChallengesModule } from './challenges/challenges.module';
import { LanguagesModule } from './languages/languages.module';
import { DifficultiesModule } from './difficulties/difficulties.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MongooseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ChallengesModule,
    LanguagesModule,
    DifficultiesModule,
    CoursesModule,
  ],
  controllers: [],
  providers: [PrismaService, MongooseService],
})
export class AppModule {}
