import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { HelpersService } from 'src/helpers/helpers.service';
import { UsersService } from 'src/users/users.service';
import { SignUpSuccessfull, SignUpData } from '../interfaces/Auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignUpService {
    constructor(
        private usersService: UsersService,
        private helpersService: HelpersService,
    ) {}

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

        if (SignUpData.phone?.length !== 11) {
            throw new BadRequestException('Número de telefone inválido');
        }

        const hashedPassword = await bcrypt.hash(SignUpData.password, 10);

        return await this.usersService.create({
            ...SignUpData,
            password: hashedPassword,
        });
    }
}
