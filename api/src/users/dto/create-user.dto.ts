import { IsInt, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  apellidos: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  // Se valida pero no se persiste en base de datos
  @IsString()
  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria' })
  passwordConfirm: string;

  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsNotEmpty({ message: 'El curso es obligatorio' })
  courseId: number;
}
