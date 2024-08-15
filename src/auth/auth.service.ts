import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {
    SignInData,
    SignInSuccessfull,
    SignUpData,
    SignUpSuccessfull,
} from './interfaces/Auth.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HelpersService } from 'src/helpers/helpers.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private readonly helpersService: HelpersService,
    ) {}

    async signIn(signInData: SignInData): Promise<SignInSuccessfull | void> {
        const user = await this.usersService.findByEmail(signInData.email);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const match = await bcrypt.compare(signInData.password, user.password);

        if (match) {
            const token = this.jwtService.sign({ id: user.id });

            return { token };
        } else {
            throw new UnauthorizedException('Incorrect password');
        }
    }

    async signUp(SignUpData: SignUpData): Promise<SignUpSuccessfull | void> {
        if (!SignUpData.email) {
            throw new BadRequestException('Email is required');
        }

        const user = await this.usersService.findByEmail(SignUpData.email);

        if (user) {
            throw new UnauthorizedException('User already exists');
        }

        if (SignUpData.password.length < 8) {
            throw new BadRequestException(
                'Password must be at least 8 characters long',
            );
        }

        if (SignUpData.password !== SignUpData.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        if (!this.helpersService.validateEmail(SignUpData.email)) {
            throw new BadRequestException('Invalid email');
        }

        if (!this.helpersService.validateCPF(SignUpData.cpf)) {
            throw new BadRequestException('Invalid CPF');
        }

        if (!(await this.helpersService.validateCNPJ(SignUpData.cnpj))) {
            throw new BadRequestException('Invalid CNPJ');
        }

        const hashedPassword = await bcrypt.hash(SignUpData.password, 10);

        await this.usersService.create({
            ...SignUpData,
            password: hashedPassword,
        });

        return {
            message: `Um email de verificação foi enviado para ${user.email}. Acesse o link para ativar sua conta.`,
        };
    }
}
