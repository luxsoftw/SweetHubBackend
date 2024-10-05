import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SignUpModule } from './sign-up/sign-up.module';

@Module({
    providers: [AuthService],
    imports: [
        CompaniesModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        SignUpModule,
    ],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
