import { Module } from '@nestjs/common';
import { MongooseService } from './mongoose.service';

@Module({
     providers: [MongooseService],
    exports: [MongooseService],
})
export class MongooseModule {}
