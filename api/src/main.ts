import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { MongooseService } from './mongoose/mongoose.service';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import kleur from 'kleur';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sql = new PrismaService();
  const mongoose = new MongooseService();

  // Adaptador de WebSockets (necesario para socket.io)
  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    kleur.green('🌐 ') +
      kleur.green().bold('Aplicación corriendo en: ') +
      kleur.cyan(await app.getUrl()),
  );

  try {
    await sql.$connect();
    console.log(kleur.green('📁 ') + kleur.green().bold('Se ha conectado a SQL'));
  } catch (error) {
    console.error(' Error conectando a SQL', error);
    console.log(
      kleur.green('❌ ') +
        kleur.green().bold('Error conectando a SQL: ') +
        kleur.cyan(error),
    );
  }

  if (mongoose.getConnection() !== null) {
    console.log(kleur.green('🍃 ') + kleur.green().bold('Se ha conectado a MongoDB'));
  }
}
bootstrap();
