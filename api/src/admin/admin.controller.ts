import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
