import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('achievements')
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get('users/:id/achievements')
  @UseGuards(JwtAuthGuard)
  findUserAchievements(@Param('id', ParseIntPipe) id: number) {
    return this.achievementsService.findUserAchievements(id);
  }
}