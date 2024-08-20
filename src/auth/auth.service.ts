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
            throw new BadRequestException('Email é obrigatório');
        }

        const user = await this.usersService.findByEmail(SignUpData.email);

        if (user) {
            throw new UnauthorizedException('Usuário já cadastrado');
        }

        if (SignUpData.password.length < 8) {
            throw new BadRequestException(
                'Senha deve conter no mínimo 8 caracteres',
            );
        }

        if (SignUpData.password !== SignUpData.confirmPassword) {
            throw new BadRequestException('Senhas não conferem');
        }

        if (!this.helpersService.validateEmail(SignUpData.email)) {
            throw new BadRequestException('Email inválido');
        }

        if (!this.helpersService.validateCPF(SignUpData.cpf)) {
            throw new BadRequestException('CPF inválido');
        }

        if (!(await this.helpersService.validateCNPJ(SignUpData.cnpj))) {
            throw new BadRequestException('CNPJ inválido');
        }

        const hashedPassword = await bcrypt.hash(SignUpData.password, 10);

        return await this.usersService.create({
            ...SignUpData,
            password: hashedPassword,
        });
    }

    async getValidationEmail(authorization: string) {
        return await this.usersService.getEmailValidationToken(authorization);
    }

    async validateEmail(token: string) {
        return await this.usersService.validateEmail(token);
    }
}
