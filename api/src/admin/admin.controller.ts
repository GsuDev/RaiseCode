import { Body, Controller, Get, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('/stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getStats() {
       return this.adminService.getStats();
    }

    @Get('/settings')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getSettings() {
        return this.adminService.getSettings();
    }

    @Patch('/settings')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    updateSettings(@Body(new ValidationPipe({ whitelist: false, forbidNonWhitelisted: false, transform: false })) dto: Record<string, string>) {
        return this.adminService.updateSettings(dto);
    }
}
