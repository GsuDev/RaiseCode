import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/*
  El decorador @Roles() almacena como metadata los roles requeridos para el endpoint.
  El RolesGuard lee esa metadata para decidir si el usuario tiene acceso.
*/
