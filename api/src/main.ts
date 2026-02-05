import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaSqlService } from './prisma-sql/prisma-sql.service';
import kleur from 'kleur';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sql = new PrismaSqlService()
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
  
}
bootstrap();
