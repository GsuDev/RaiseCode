import { Controller, Get } from '@nestjs/common';
import { DifficultiesService } from './difficulties.service';

@Controller('difficulties')
export class DifficultiesController {
  constructor(private readonly difficultiesService: DifficultiesService) {}

  /** GET /api/difficulties — público */
  @Get()
  findAll() {
    return this.difficultiesService.findAll();
  }
}
