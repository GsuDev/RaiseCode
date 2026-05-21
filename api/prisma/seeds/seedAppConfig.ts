import { PrismaClient } from '../../generated/client/client';

export async function seedAppConfig(prisma: PrismaClient) {
    console.log('  -> Insertando AppConfig');
    
    await prisma.appConfig.createMany({
        data: [
            {
                key: 'registrationEnabled',
                value: 'true',
            }
        ]
    });
}