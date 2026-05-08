import { PrismaClient } from '../../generated/client/client';

export async function seedCatalogues(prisma: PrismaClient) {
  console.log('  -> Insertando Catálogos (Dificultades, Lenguajes, Roles, Ciclos, Logros)...');
  
    // Dificultades predefinidas para los retos
    await prisma.dificulty.createMany({
        data: [{ name: 'Easy' }, { name: 'Medium' }, { name: 'Hard' }],
    });

    // Lenguajes predefinidos para los retos
    await prisma.language.createMany({
        data: [{ name: 'JavaScript' }, { name: 'Python' }, { name: 'Java' }, { name: 'TypeScript' }, { name: 'Kotlin' }],
    });

    // Roles predefinidos para los usuarios
    await prisma.role.createMany({
        data: [{ name: 'USER' }, { name: 'ADMIN' }],
    });

    // Ciclos predefinidos para los usuarios
    await prisma.course.createMany({
        data: [{ name: 'DAW' }, { name: 'DAM' }, { name: 'ASIR' }],
    });

    // Logros predefinidos para los usuarios
    // Por ahora se dejan vicios debido a que falla al crear logros
    //   await prisma.achievement.createMany({
    //     data: [
    //       { name: 'Primer Paso', description: 'Completa tu primer reto', xpReward: 10 },
    //       { name: 'En Racha', description: 'Completa 5 retos', xpReward: 25 },
    //       { name: 'Especialista', description: 'Completa 10 retos en la misma asignatura', xpReward: 50 },
    //       { name: 'Explorador', description: 'Completa retos en 3 asignaturas distintas', xpReward: 30 },
    //       { name: 'Centurión', description: 'Acumula 100 XP', xpReward: 50 },
    //     ],
    //   });
}