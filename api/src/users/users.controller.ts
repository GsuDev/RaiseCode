import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateBulkGenericUsersDto } from './dto/create-bulk-generic-users.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.usersService.findAll(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10
        );
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: Request & { user: any }) {
        const userId = req.user.id;
        return this.usersService.findProfile(userId);
    }

    @Post('bulk-generic')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    createBulkGenericUsers(@Body() bulkDto: CreateBulkGenericUsersDto) {
        return this.usersService.createBulkGenericUsers(bulkDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }
    
    @Patch(':id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
        const userId = req.user.id;
        return this.usersService.remove(+id, userId);
    }
}
