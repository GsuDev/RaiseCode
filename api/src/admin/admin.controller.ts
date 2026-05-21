import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AdminService } from './admin.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

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
    updateSettings(@Body() dto: UpdateSettingsDto) {
        return this.adminService.updateSettings(dto);
    }
}
