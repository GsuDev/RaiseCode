import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos definidos con el decorador @Roles()
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Obtener el usuario del request (inyectado por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) return false;

    // Verificar que el usuario tenga al menos uno de los roles requeridos
    return user.roles.some(role => requiredRoles.includes(role));
  }
}
