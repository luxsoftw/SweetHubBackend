import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SignUpModule } from './sign-up/sign-up.module';

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
        SignUpModule,
    ],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
