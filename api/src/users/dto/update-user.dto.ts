import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// TODO: Completar con los campos que se puedan actualizar
export class UpdateUserDto extends PartialType(CreateUserDto) {}
