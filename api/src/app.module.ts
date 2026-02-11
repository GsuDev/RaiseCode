import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseService } from './mongoose/mongoose.service';
import { MongooseModule } from './mongoose/mongoose.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [PrismaModule, MongooseModule],
  controllers: [],
  providers: [PrismaService, MongooseService],
})
export class AppModule {}
