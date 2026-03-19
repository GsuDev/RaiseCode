import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { ExecutionResultDto } from './dto/execution-result.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  /**
   * POST /api/execution
   * El usuario envía su código para ejecutar.
   * Devuelve { jobId } con HTTP 202 — el resultado llega por WebSocket.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(202)
  submit(@Body() dto: SubmitCodeDto, @Request() req: any) {
    return this.executionService.submit(dto, req.user.id);
  }

  /**
   * POST /api/execution/result
   * Endpoint interno — solo el worker puede llamarlo (X-Worker-Secret).
   * Recibe el resultado de la ejecución, lo emite por WS y guarda si accepted.
   */
  @Post('result')
  @HttpCode(200)
  handleResult(
    @Body() dto: ExecutionResultDto,
    @Headers('x-worker-secret') workerSecret: string,
  ) {
    return this.executionService.handleResult(dto, workerSecret);
  }
}
