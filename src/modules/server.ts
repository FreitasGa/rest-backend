import type { Server } from 'http';
import type { Socket } from 'net';

export interface ServerModule {
  handleConnections(): void;
  handleDisconnections(): void;
}

export class HttpServerModule implements ServerModule {
  private readonly server: Server;
  private sockets: Socket[] = [];

  constructor(server: Server) {
    this.server = server;
  }

  handleConnections(): void {
    this.server.on('connection', (socket) => {
      this.sockets.push(socket);

      socket.on('close', () => {
        this.sockets = this.sockets.filter(
          (existingSocket) => existingSocket !== socket
        );
      });
    });
  }

  handleDisconnections(): void {
    this.server.close(() => process.exit(0));

    setTimeout(() => process.exit(1), 10 * 1000);

    this.sockets.forEach((socket) => socket.end());
    
    setTimeout(
      () => this.sockets.forEach((socket) => socket.destroy()),
      5 * 1000
    );
  }
}
