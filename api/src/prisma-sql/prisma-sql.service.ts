import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from 'prismaClient/sql/client'
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaSqlService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb(
        {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }
    )
    super({ adapter, log: ['query', 'warn', 'error'] });
  }
}
