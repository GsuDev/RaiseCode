import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.achievement.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findUserAchievements(userId: number) {
    return this.prisma.userAchievements.findMany({
      where: { userId },
      include: {
        achivement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async evaluateForUser(userId: number): Promise<any[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        completedChallenges: {
          include: {
            challenge: {
              include: { subject: true },
            },
          },
        },
        userAchievements: true,
      },
    });

    if (!user) return [];

    const completedCount = user.completedChallenges.length;
    const unlockedIds = user.userAchievements.map((ua) => ua.achievementId);
    const newlyUnlocked: any[] = [];

    // Contar completions por asignatura
    const subjectMap = new Map<number, number>();
    for (const cc of user.completedChallenges) {
      const sid = cc.challenge.subjectId;
      subjectMap.set(sid, (subjectMap.get(sid) ?? 0) + 1);
    }
    const distinctSubjects = subjectMap.size;
    const maxInOneSubject = Math.max(...Array.from(subjectMap.values()), 0);

    const allAchievements = await this.prisma.achievement.findMany();

    for (const achievement of allAchievements) {
      if (unlockedIds.includes(achievement.id)) continue;

      let conditionMet = false;

      if (achievement.name === 'Primer Paso' && completedCount >= 1) conditionMet = true;
      if (achievement.name === 'En Racha' && completedCount >= 5) conditionMet = true;
      if (achievement.name === 'Especialista' && maxInOneSubject >= 10) conditionMet = true;
      if (achievement.name === 'Explorador' && distinctSubjects >= 3) conditionMet = true;
      if (achievement.name === 'Centurión' && user.xp >= 100) conditionMet = true;

      if (conditionMet) {
        await this.prisma.userAchievements.create({
          data: { userId, achievementId: achievement.id },
        });
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }
}