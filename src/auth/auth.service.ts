import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInData, SignInSuccessfull } from './interfaces/Auth.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInData: SignInData): Promise<SignInSuccessfull | void> {
        const user = await this.usersService.findByEmail(signInData.email);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const match = await bcrypt.compare(signInData.password, user.password);

        if (!match) {
            throw new UnauthorizedException('Incorrect password');
        }

        const token = this.jwtService.sign({ id: user.id });

        return { token };
    }

    async getValidationEmail(authorization: string) {
        return await this.usersService.getEmailValidationToken(authorization);
    }

    async validateEmail(token: string) {
        return await this.usersService.validateEmail(token);
    }
}
