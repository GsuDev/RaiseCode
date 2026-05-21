import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async getGlobalRanking(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.user.count(),
    ]);

    const data = users.map((user, index) => ({
      position: skip + index + 1, 
      userId: user.id,
      username: `${user.name} ${user.lastname}`, 
      xp: user.xp,
      completedCount: user._count.completedChallenges,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getSubjectRanking(subjectId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    
    const allUsers = await this.prisma.user.findMany({
      where: {
        completedChallenges: {
          some: {
            challenge: {
              subjectId: subjectId,
            },
          },
        },
      },
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

    
    const sortedUsers = allUsers
      .map((user) => ({
        userId: user.id,
        username: `${user.name} ${user.lastname}`,
        completedCount: user.completedChallenges.length,
      }))
      .sort((a, b) => b.completedCount - a.completedCount);

    const total = sortedUsers.length;
    const paginatedUsers = sortedUsers.slice(skip, skip + limit);

    const data = paginatedUsers.map((user, index) => ({
      position: skip + index + 1,
      ...user,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
}