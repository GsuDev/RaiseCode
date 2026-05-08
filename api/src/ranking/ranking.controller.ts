import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('global')
  async getGlobal() {
    return await this.rankingService.getGlobalRanking();
  }

  @Get('subjects/:subjectId')
  async getSubject(@Param('subjectId', ParseIntPipe) subjectId: number) {
    return await this.rankingService.getSubjectRanking(subjectId);
  }
}