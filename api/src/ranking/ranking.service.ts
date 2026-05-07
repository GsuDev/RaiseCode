import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async getGlobalRanking() {
    const users = await this.prisma.user.findMany({
      take: 50,
      orderBy: {
        xp: 'desc',
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        xp: true,
        _count: {
          select: {
            completedChallenges: true, 
          },
        },
      },
    });

    return users.map((user, index) => ({
      position: index + 1,
      userId: user.id,
      username: `${user.name} ${user.lastname}`, 
      xp: user.xp,
      completedCount: user._count.completedChallenges,
    }));
  }

  async getSubjectRanking(subjectId: number) {
    const users = await this.prisma.user.findMany({
      where: {
        completedChallenges: {
          some: {
            challenge: {
              subjectId: subjectId,
            },
          },
        },
      },
      take: 50,
      select: {
        id: true,
        name: true,
        lastname: true,
        completedChallenges: {
          where: {
            challenge: {
              subjectId: subjectId,
            },
          },
        },
      },
    });

    return users
      .map((user) => ({
        userId: user.id,
        username: `${user.name} ${user.lastname}`,
        completedCount: user.completedChallenges.length,
      }))
      .sort((a, b) => b.completedCount - a.completedCount)
      .map((user, index) => ({
        position: index + 1,
        ...user,
      }));
  }
}