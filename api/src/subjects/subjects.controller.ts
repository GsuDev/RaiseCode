import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }

  @Get(':id/challenges')
  findChallenges(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page = '1',
    @Query('limit') limit = '12',
  ) {
    return this.subjectsService.findChallengesBySubject(
      id,
      parseInt(page),
      parseInt(limit),
    );
  }
}
