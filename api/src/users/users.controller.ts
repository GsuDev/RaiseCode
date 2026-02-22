import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Completar
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    throw new Error('Not implemented');
  }

  // TODO: Completar
  @Get()
  findAll() {
    throw new Error('Not implemented');
  }

  // TODO: Completar
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    throw new Error('Not implemented');
  }

  // TODO: Completar
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    throw new Error('Not implemented');
  }

  // TODO: Completar
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    throw new Error('Not implemented');
  }
}
