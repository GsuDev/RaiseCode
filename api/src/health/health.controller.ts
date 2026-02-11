import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}