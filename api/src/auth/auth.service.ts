import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/client/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Genera un token JWT con el mismo payload que usa el profe.
   * Incluye sub (id), email y roles del usuario.
   */
  generateToken(user: User & { roles: string[] }) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: Array.isArray(user.roles) ? user.roles : [user.roles], // Aseguramos array
    };

    return {
      payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
