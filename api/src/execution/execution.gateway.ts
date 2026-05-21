import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Gateway de WebSockets para el módulo de ejecución.
 * Solo emite — no recibe mensajes del cliente.
 * El cliente se suscribe al evento "execution:result:{jobId}".
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class ExecutionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // El cliente envía su userId como query param al conectarse
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(`user:${userId}`);
    }
  }

  /**
   * Emite el resultado de una ejecución solo a los sockets del usuario
   */
  emitResult(jobId: string, userId: number, payload: object): void {
    this.server.to(`user:${userId}`).emit(`execution:result:${jobId}`, payload);
  }

  emitAchievements(userId: number, achievements: any []): void {
    this.server.to(`user:${userId}`).emit(`achievement:unlocked:${userId}`, achievements);
  }
}