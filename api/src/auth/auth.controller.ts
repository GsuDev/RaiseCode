import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AdminService } from 'src/admin/admin.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() createUserDto: CreateUserDto) {
    const registrationEnabled = await this.adminService.getSetting('registrationEnabled');
    if (registrationEnabled === 'false') {
      throw new ForbiddenException('El registro está desactivado temporalmente');
    }
    const user = await this.usersService.createUser(createUserDto);
    const { password, ...userWithoutPassword } = user;
    const tokenData = this.authService.generateToken({
      ...user,
      roles: ['USER'],
    });
    return {
      message: 'Usuario registrado correctamente',
      user: userWithoutPassword,
      ...tokenData,
    };
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.validateUser(loginDto);
    const roles = user.userRoles.map((ur) => ur.role.name);
    const { password, userRoles, ...userWithoutPassword } = user;
    const tokenData = this.authService.generateToken({ ...user, roles });
    return {
      message: 'Login correcto',
      user: userWithoutPassword,
      ...tokenData,
    };
  }

  @Get('registration-status')
  async getRegistrationStatus() {
    const value = await this.adminService.getSetting('registrationEnabled');
    return { registrationEnabled: value !== 'false' };
  }
}
