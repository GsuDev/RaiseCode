import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

/**
 * Gateway de WebSockets para el módulo de ejecución.
 * Solo emite — no recibe mensajes del cliente.
 * El cliente se suscribe al evento "execution:result:{jobId}".
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class ExecutionGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Emite el resultado de una ejecución al cliente que se suscribió
   * al evento correspondiente a su jobId.
   */
  emitResult(jobId: string, payload: object): void {
    this.server.emit(`execution:result:${jobId}`, payload);
  }
}
