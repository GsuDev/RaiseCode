import { PrismaClient } from '../generated/client/client';
import { seedCatalogues } from './seeds/seedCatalogues';
import { seedSubjects } from './seeds/seedSubjects';
import { seedUsers } from './seeds/seedUsers';
import { seedChallenges } from './seeds/seedChallenges';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { seedAppConfig } from './seeds/seedAppConfig';

const adapter = new PrismaMariaDb(
        {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }
    )
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Limpiando base de datos...');
    // Limpieza en orden inverso a las dependencias
    await prisma.completedChallenges.deleteMany();
    await prisma.challengeTest.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.subjectCourse.deleteMany();
    await prisma.userSubjects.deleteMany();
    await prisma.userAchievements.deleteMany();
    await prisma.userRoles.deleteMany();
    await prisma.user.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.course.deleteMany();
    await prisma.dificulty.deleteMany();
    await prisma.language.deleteMany();
    await prisma.role.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.appConfig.deleteMany();

    console.log('Iniciando seeding...');
    await seedAppConfig(prisma);
    await seedCatalogues(prisma);
    await seedSubjects(prisma);
    await seedUsers(prisma);
    await seedChallenges(prisma);
    console.log('Seeding completado con éxito');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });