import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { MongooseService } from './mongoose/mongoose.service';
import kleur from 'kleur';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sql = new PrismaService()
  const mongoose = new MongooseService()
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);

  // Mensaje que muestra la url de la api
  console.log(
    kleur.green('🌐 ') +
    kleur.green().bold('Aplicación corriendo en: ') +
    kleur.cyan(await app.getUrl())
  );

  // Mensaje que muestra el estado con la conexion de SQL
  try {
    await sql.$connect()
    console.log(
      kleur.green('📁 ') +
      kleur.green().bold('Se ha conectado a SQL')
    );
  } catch (error) {
    console.error(" Error conectando a SQL", error)
    console.log(
      kleur.green('❌ ') +
      kleur.green().bold('Error conectando a SQL: ') +
      kleur.cyan(error)
    );
  }

  // Mensaje que muestra el estado con la conexion de Mongo
  if (mongoose.getConnection() !== null) {
    console.log(
            kleur.green('🍃 ') +
            kleur.green().bold('Se ha conectado a MongoDB')
        )
  }
}
bootstrap();
