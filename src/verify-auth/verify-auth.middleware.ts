import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';

interface RequestWithUser extends Request {
    user?: User;
}

@Injectable()
export class VerifyAuthMiddleware implements NestMiddleware {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}
    async use(req: RequestWithUser, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new UnauthorizedException('Token inválido');

        const token = Array.isArray(authHeader)
            ? authHeader[1]
            : authHeader.split(' ')[1];
        if (!token) throw new UnauthorizedException('Token inválido');

        const id = this.jwtService.decode(token).id;
        const user = await this.usersService.findById(id);
        if (!user) throw new UnauthorizedException('Usuário não encontrado');

        if (!user.isValidated) {
            throw new UnauthorizedException('Valide seu email para continuar', {
                cause: 'verification-email',
            });
        }

        req.body.user = user;
        next();
    }
}
