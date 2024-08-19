import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
    imports: [PrismaModule, NodemailerModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
