import { PrismaClient } from '../generated/client/client';
import { seedCatalogues } from './seeds/seedCatalogues';
import { seedSubjects } from './seeds/seedSubjects';

const prisma = new PrismaClient();

async function main() {
    console.log('Limpiando base de datos...');
    // Limpieza en orden inverso a las dependencias
    await prisma.completedChallenge.deleteMany();
    await prisma.challengeTest.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.subjectCourse.deleteMany();
    await prisma.userSubject.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.course.deleteMany();
    await prisma.dificulty.deleteMany();
    await prisma.language.deleteMany();
    await prisma.role.deleteMany();
    await prisma.achievement.deleteMany();

    console.log('Iniciando seeding...');
    await seedCatalogues(prisma);
    await seedSubjects(prisma);
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