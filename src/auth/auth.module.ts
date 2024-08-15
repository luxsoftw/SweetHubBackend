import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        HelpersModule,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
