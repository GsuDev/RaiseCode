import { Module } from '@nestjs/common';
import { PrismaSqlService } from './prisma-sql.service';

@Module({
    providers: [PrismaSqlService],
    exports: [PrismaSqlService],
})
export class PrismaSqlModule {}
