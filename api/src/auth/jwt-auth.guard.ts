import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Falta la cabecera de autorización');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Falta el token');
    }

    try {
      const decoded: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });

      // Aseguramos que roles siempre sea un array
      request.user = {
        id: decoded.sub,
        email: decoded.email,
        roles: Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles],
      };

      return true; // Token válido, continúa al RolesGuard
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
