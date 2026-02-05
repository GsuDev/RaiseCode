import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import kleur from 'kleur';
import mongoose from 'mongoose';

@Injectable()
export class MongooseService implements OnModuleInit, OnModuleDestroy {
    private connection: typeof mongoose;
    
    constructor () {}

    async onModuleInit() {
        try {
            this.connection = await mongoose.connect(process.env.MONGO_URL!, {})
            
        } catch (error) {
            console.log(
                kleur.red('❌ Error conectando a MongoDB: ') +
                kleur.red(error)
            )
        }
    }

    async onModuleDestroy() {
        await mongoose.disconnect();
        console.log(kleur.magenta('MongoDB desconectado'))
    }

    getConnection() {
        return this.connection;
    }
}