import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  /**
   * GET /api/challenges/featured — público, top 5 validados más completados.
   * IMPORTANTE: debe declararse ANTES de /:id para que NestJS no lo trate como parámetro.
   */
  @Get('featured')
  findFeatured() {
    return this.challengesService.findFeatured();
  }

  /**
   * GET /api/challenges — público con paginación.
   * Query params: ?page=1&limit=10
   */
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.challengesService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  /**
   * GET /api/challenges/:id — público.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.challengesService.findOne(id);
  }

  /**
   * POST /api/challenges — protegido. El creatorId se extrae del token JWT.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateChallengeDto, @Request() req: any) {
    const creatorId: number = req.user.id; // inyectado por JwtAuthGuard desde payload.sub
    return this.challengesService.create(dto, creatorId);
  }

  /**
   * PATCH /api/challenges/:id — solo admins.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChallengeDto,
  ) {
    return this.challengesService.update(id, dto);
  }

  /**
   * DELETE /api/challenges/:id — solo admins.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.challengesService.remove(id);
  }
}
