# Prisma con SQL

## Archivos de configuración de prisma
```
prisma/
 ├── schema.prisma            - Archivo generador del cliente SQL
prisma.config.ts              - Archivo de configuración del cliente
```

## Contenido de los archivos

### schema.prisma
```
generator client {
  provider = "prisma-client"
  output   = "../generated/client"
  moduleFormat  = "cjs"
}

datasource db {
  provider = "mysql"
}
```

### prisma.config.ts
```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env("DATABASE_URL")
  },
});

```

## Comandos para la generación del cliente

```bash
yarn prisma generate
```

## Configurar modulo de prisma

### Estructura del modulo:
```
prisma/
 ├── prisma.service.ts           
 ├── prisma.module.ts         
```

### prisma.service.ts:
```ts
import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from 'generated/client/client'
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb(
        {
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        }
    )
    super({ adapter, log: ['query', 'warn', 'error'] });
  }
}

```

### prisma.module.ts:
```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- muy importante, exportamos para otros módulos
})
export class PrismaModule {}
```

## Configurar modulo de mongoose
### Estructura del modulo:
```
mongoose/
 ├── mongoose.service.ts           
 ├── mongoose.module.ts         
```

### prismaMongo.service.ts:
```ts
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
```

### prismaMongo.module.ts:
```ts
import { Module } from '@nestjs/common';
import { MongooseService } from './mongoose.service';

@Module({
     providers: [MongooseService],
    exports: [MongooseService],
})
export class MongooseModule {}

```

## Como importar los servicios
```ts
// SQL
import {PrismaService} from "../prisma/prisma.service"
constructor(private sql: PrismaService) {}

// Mongo
import {MongooseService} from "../mongoose/mongoose.service"
constructor(private mongo: MongooseService) {}
```

## Scrips

### Scripts prisma:
```bash
# Generar el cliente de prisma
yarn prisma generate

# Realizar migraciones de los modelos
yarn prisma migrate

# Ejecutar los seeder para poblar las tablas
yarn prisma db seed
```