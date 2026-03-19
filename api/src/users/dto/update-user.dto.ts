import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
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
