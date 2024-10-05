import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { SocketGateway } from './socket.gateway';

@Module({
    providers: [SocketService, SocketGateway],
    imports: [CompaniesModule],
})
export class SocketModule {}
