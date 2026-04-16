import { IsString, IsNumber, Min, Max, MinLength, Matches } from 'class-validator';

export class CreateBulkGenericUsersDto {
  @IsString()
  @MinLength(3, { message: 'El prefijo debe tener al menos 3 caracteres' })
  @Matches(/^\S+$/, { message: 'El prefijo no puede contener espacios' })
  prefix: string;

  @IsNumber()
  @Min(1, { message: 'Debe generar al menos 1 usuario' })
  @Max(50, { message: 'No se pueden generar más de 50 usuarios de una vez' })
  count: number;
}

export interface GeneratedUserCredentials {
  username: string;
  password: string;
}
