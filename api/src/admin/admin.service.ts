import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async getTotalUsers() {
        return this.prisma.user.count();
    }
    async getTotalChallenges() { 
        return this.prisma.challenge.count();
    }
    async getPendingChallenges() { 
        return this.prisma.challenge.count({
            where: { validate: false }
        });
    }
    async getTotalCompletions() { 
        return this.prisma.completedChallenges.count();
    }
    async getTopChallenge() { 
        const challenge = await this.prisma.challenge.findFirst({
            orderBy: {
                completedChallenges: { _count: 'desc' }
            },
            select: {
                id: true,
                title: true,
                _count: { select: { completedChallenges: true } }
            }
        });

        return challenge ? {
            id: challenge.id,
            title: challenge.title,
            completedCount: challenge._count.completedChallenges
        } : null;
    }
    async getTopUser() { 
        return this.prisma.user.findFirst({
            orderBy: { xp: 'desc' },
            select: { name: true, xp: true }
        })
    }
    async getActivityLast7Days() { 
        return this.prisma.completedChallenges.groupBy({
            by: ['createdAt'],
            _count: true,
            where: {
                createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        })
    }

    async getSettings() {
        const configs = await this.prisma.appConfig.findMany();
        return configs.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as Record<string, string>);
    }

    async getSetting(key ?: string) {
        const config = await this.prisma.appConfig.findUnique({ where: { key } });
        return config ? { [config.key]: config.value } : {};
    }

    async updateSettings(data: Record<string, string>) {
        const upserts = Object.entries(data).map(([key, value]) =>
            this.prisma.appConfig.upsert({
                where: { key },
                create: { key, value },
                update: { value },
            })
        );
        await Promise.all(upserts);
        return this.getSettings();
    }

    async getStats() {
        return {
            totalUsers: await this.getTotalUsers(),
            totalChallenges: await this.getTotalChallenges(),
            pendingChallenges: await this.getPendingChallenges(),
            totalCompletions: await this.getTotalCompletions(),
            topChallenge: await this.getTopChallenge(),
            topUser: await this.getTopUser(),
            activityLast7Days: await this.getActivityLast7Days(),
        };
    }
    
}
