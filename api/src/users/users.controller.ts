import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
        console.log('--- DEBUG INFO ---');
        console.log('Objeto req.user completo:', req.user);
        console.log('Tipo de dato del ID:', typeof req.user?.id);
        console.log('Valor exacto del ID:', req.user?.id);
        console.log('------------------');
        return this.usersService.findProfile(userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    
    
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.usersService.update(+id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.usersService.remove(+id);
    // }
}
