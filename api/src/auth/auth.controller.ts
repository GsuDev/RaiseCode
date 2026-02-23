import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * Endpoint de registro de usuario.
   * Crea el usuario, asigna el rol USER y devuelve usuario + token JWT.
   */
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() createUserDto: CreateUserDto) {
    // Crear usuario y asignar rol USER por defecto
    const user = await this.usersService.createUser(createUserDto);

    // Excluir la contraseña de la respuesta
    const { password, ...userWithoutPassword } = user;

    // Generar token con los roles del usuario
    const tokenData = this.authService.generateToken({
      ...user,
      roles: ['USER'], // Rol asignado por defecto en el registro
    });

    return {
      message: 'Usuario registrado correctamente',
      user: userWithoutPassword,
      ...tokenData, // Devuelve payload + access_token como hace el profe
    };
  }
}
