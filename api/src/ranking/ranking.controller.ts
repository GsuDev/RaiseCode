import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('global')
  async getGlobal(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.rankingService.getGlobalRanking(pageNumber, limitNumber);
  }

  @Get('subjects/:subjectId')
  async getSubject(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return await this.rankingService.getSubjectRanking(subjectId, pageNumber, limitNumber);
  }
}