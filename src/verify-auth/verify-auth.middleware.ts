import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class VerifyAuthMiddleware implements NestMiddleware {
    constructor(
        private companiesService: CompaniesService,
        private jwtService: JwtService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
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

        if (!company.isValidated) {
            throw new UnauthorizedException('Valide seu email para continuar', {
                cause: 'verification-email',
            });
        }

        req.body.company = company;
        next();
    }
}
