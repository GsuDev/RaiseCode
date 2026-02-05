import { Module } from '@nestjs/common';
import { PrismaSqlService } from './prisma-sql/prisma-sql.service';
import { PrismaSqlModule } from './prisma-sql/prisma-sql.module';


@Module({
  imports: [PrismaSqlModule],
  controllers: [],
  providers: [PrismaSqlService],
})
export class AppModule {}
