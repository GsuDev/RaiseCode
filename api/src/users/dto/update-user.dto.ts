import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsInt({ message: 'El ID del curso debe ser un número entero' })
  @IsOptional()
  courseId?: number;
}
import { IsEmail, IsOptional, IsString} from 'class-validator';

// TODO: Completar con los campos que se puedan actualizar
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    lastname: string;

    @IsEmail({}, { message: 'El email no tiene un formato válido' })
    @IsOptional()
    email: string;
}
