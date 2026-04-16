import { PrismaClient } from '../../generated/client/client';


export async function seedUsers(prisma: PrismaClient) {
    console.log('  -> Insertando Usuarios...');

    const dawCourse = await prisma.course.findFirst({ where: { name: 'DAW' } });
    const damCourse = await prisma.course.findFirst({ where: { name: 'DAM' } });

    const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
    const userRole = await prisma.role.findFirst({ where: { name: 'USER' } });

    await prisma.user.create({
        data: {
        email: 'admin@raisecode.dev',
        name: 'Admin',
        lastname: 'RaiseCode',
        password: '$2b$10$i0xiTtSqceYh91RrZebfFO29K/8YhENiOM5QJ81IKiID4w8IEgVMu',
        courseId: dawCourse!.id,
        userRoles: {
            create: [
            { roleId: adminRole!.id },
            { roleId: userRole!.id }
            ]
        }
        }
    });

    await prisma.user.create({
        data: {
        email: 'user@raisecode.dev',
        name: 'Usuario',
        lastname: 'Demo',
        password: '$2b$10$HTTLwq285R6MURN4mmJuWOQdxkdSpc9x7LSyLMUwKEavhHWJ1UgG6',
        courseId: damCourse!.id,
        userRoles: {
            create: [
            { roleId: userRole!.id }
            ]
        }
        }
    });
}