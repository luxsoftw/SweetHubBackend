import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { UsersModule } from 'src/users/users.module';
import { SocketGateway } from './socket.gateway';

@Module({
    providers: [SocketService, SocketGateway],
    imports: [UsersModule],
})
export class SocketModule {}
