import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
    handleConnection(socket: Socket) {
        socket.on('connection', (client) => {
            console.log(`Client connected: ${client.id}`);
        });
    }
}
