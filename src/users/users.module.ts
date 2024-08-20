import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        PrismaModule,
        NodemailerModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
