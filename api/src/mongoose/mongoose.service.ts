import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import kleur from 'kleur';
import mongoose from 'mongoose';

@Injectable()
export class MongooseService implements OnModuleInit, OnModuleDestroy {
    private connection: typeof mongoose;
    
    constructor () {}

    // Al iniciar el modulo, realiza la conexión
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

    // Al finalizar el modulo, corta la conexión
    async onModuleDestroy() {
        await mongoose.disconnect();
        console.log(kleur.magenta('MongoDB desconectado'))
    }

    // Metodo para recoger el estado de la conexión
    getConnection() {
        return this.connection;
    }
}