import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CompaniesService } from 'src/companies/companies.service';
import { SignInData, SignInSuccessfull } from './interfaces/Auth.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly companiesService: CompaniesService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInData: SignInData): Promise<SignInSuccessfull | void> {
        const company = await this.companiesService.findByEmail(
            signInData.email,
        );

        if (!company) {
            throw new UnauthorizedException('User not found');
        }
        const match = await bcrypt.compare(
            signInData.password,
            company.password,
        );

        if (!match) {
            throw new UnauthorizedException('Incorrect password');
        }

        const token = this.jwtService.sign({ id: company.id });

        return { token };
    }

    async getValidationEmail(authHeader: string) {
        if (!authHeader) throw new UnauthorizedException('Token inválido');

        const token = Array.isArray(authHeader)
            ? authHeader[1]
            : authHeader.split(' ')[1];
        if (!token) throw new UnauthorizedException('Token inválido');

        const id = this.jwtService.decode(token)?.id;
        if (!id) {
            throw new UnauthorizedException('Token inválido');
        }

        const company = await this.companiesService.findById(id);
        if (!company) throw new UnauthorizedException('Usuário não encontrado');

        return await this.companiesService.getEmailValidationToken(company);
    }

    async validateEmail(token: string) {
        return await this.companiesService.validateEmail(token);
    }
}
