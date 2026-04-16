import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExecutionGateway } from './execution.gateway';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { ExecutionResultDto } from './dto/execution-result.dto';
import { AchievementsService } from 'src/achievements/achievements.service';


@Injectable()
export class ExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ExecutionGateway,
    private readonly achievementsService: AchievementsService,
  ) {}

  /**
   * Recibe el código del usuario, busca los tests del reto en BD,
   * encola el job en el worker y devuelve el jobId al cliente.
   */
  async submit(dto: SubmitCodeDto, userId: number): Promise<{ jobId: string }> {
    // 1. Verificar que el reto existe y está validado
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId },
      select: {
        id: true,
        validate: true,
        language: { select: { name: true } },
        tests: {
          select: { input: true, expectedOutput: true, hidden: true },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException(`Reto con ID ${dto.challengeId} no encontrado`);
    }

    if (!challenge.validate) {
      throw new BadRequestException('Este reto aún no ha sido validado por un administrador');
    }

    // 2. Verificar que tiene tests
    if (!challenge.tests || challenge.tests.length === 0) {
      throw new BadRequestException('Este reto no tiene tests de validación');
    }

    // 3. Generar jobId único
    const jobId = crypto.randomUUID();

    // 4. Preparar test_cases en el formato que espera el worker
    const test_cases = challenge.tests.map((t) => ({
      expected_output: t.expectedOutput,
      input: t.input,
      hidden: t.hidden,
    }));

    // 5. Encolar en el worker
    const workerUrl = process.env.WORKER_URL ?? 'http://worker:4000';

    const workerResponse = await fetch(`${workerUrl}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submission_id: jobId,
        language: challenge.language.name.toLowerCase(),
        code: dto.code,
        test_cases,
        user_id: userId,
        challenge_id: dto.challengeId,
      }),
    });

    if (!workerResponse.ok) {
      throw new BadRequestException('Error al encolar la ejecución en el worker');
    }

    return { jobId };
  }

  /**
   * Recibe el resultado del worker, lo emite por WebSocket al cliente
   * y si todos los tests pasan guarda en CompletedChallenges.
   */
  async handleResult(dto: ExecutionResultDto, workerSecret: string): Promise<{ ok: boolean }> {
    // 1. Validar secret del worker
    const expectedSecret = process.env.WORKER_SECRET ?? '';
    if (!expectedSecret || workerSecret !== expectedSecret) {
      throw new ForbiddenException('Worker secret inválido');
    }

    // 2. Si fue accepted, guardar en CompletedChallenges (upsert para evitar duplicados)
    if (dto.status === 'accepted') {
      await this.prisma.completedChallenges.upsert({
        where: {
          userId_challengeId: {
            userId: dto.userId,
            challengeId: dto.challengeId,
          },
        },
        update: {
          time: BigInt(Math.round(dto.execution_time * 1000)),
          Code: dto.stdout.slice(0, 1500),
        },
        create: {
          userId: dto.userId,
          challengeId: dto.challengeId,
          time: BigInt(Math.round(dto.execution_time * 1000)),
          Code: dto.stdout.slice(0, 1500),
        },
      });
    }

    // Obtener XP segun la dificultad
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId },
      include: { dificulty: true },
    });

    if (challenge) {
      const xpMap: Record<string, number> = {
        Easy: 10,
        Medium: 25,
        Hard: 50,
      };
      const xpToAdd = xpMap[challenge.dificulty.name] ?? 10;

      await this.prisma.user.update({
        where: { id: dto.userId },
        data: { xp: { increment: xpToAdd }},
      });

      await this.achievementsService.evaluateForUser(dto.userId);
    }

    // 3. Emitir resultado por WebSocket al cliente que está escuchando este jobId
    this.gateway.emitResult(dto.jobId, {
      status: dto.status,
      score: dto.score,
      tests_passed: dto.tests_passed,
      tests_total: dto.tests_total,
      test_results: dto.test_results,
      stdout: dto.stdout,
      stderr: dto.stderr,
      execution_time: dto.execution_time,
    });

    return { ok: true };
  }
}
