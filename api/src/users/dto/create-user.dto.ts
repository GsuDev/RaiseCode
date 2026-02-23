import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Cycle } from 'generated/client/client';

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

  @IsEnum(Cycle, { message: 'El ciclo debe ser DAW, DAM o ASIR' })
  @IsNotEmpty({ message: 'El ciclo es obligatorio' })
  cycle: Cycle;
}
