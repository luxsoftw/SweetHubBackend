import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
    imports: [PrismaModule],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
