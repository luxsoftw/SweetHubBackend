import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SocketService {
    private readonly connectedUsers: Map<string, Socket> = new Map<string, Socket>();

    constructor (private readonly usersService: UsersService) {};
    handleConnection(socket: Socket) {
        socket.on('login', (data => {
            this.usersService.findByEmail(data.email).then((user) => {
                if (!user) return socket.emit('login', "User not found");

                if (data.password === user.password) {
                    this.connectedUsers.set(user.email, socket);
                    socket.emit('login', "Login successful");
                } else {
                    socket.emit('login', "Invalid password");
                }
                socket.on('disconnect', () => {
                    this.connectedUsers.delete(user.email);
                });
            });
        }));

        socket.on('signin', (data => {
            this.usersService.signIn(data).then(user => {
                if (user) {
                    socket.emit('signin', 'User created');
                }
            })
        }))

    }
}
