import { Controller, Get } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /** GET /api/courses — público */
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }
}
