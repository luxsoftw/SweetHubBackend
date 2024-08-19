import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface UserToCreate extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    confirmPassword: string;
}

@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService,
        private nodemailerService: NodemailerService,
    ) {}

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                fantasyName: true,
                email: true,
                cpf: true,
                cnpj: true,
                addressNumber: true,
                companyName: true,
                createdAt: true,
                streetName: true,
                updatedAt: true,
                zipCode: true,
                isValidated: true,
            },
        });

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async create(data: UserToCreate): Promise<User> {
        const user = await this.prismaService.user.create({
            data: {
                email: data.email,
                password: data.password,
                fantasyName: data.fantasyName,
                cpf: data.cpf,
                cnpj: data.cnpj,
                addressNumber: data.addressNumber,
                companyName: data.companyName,
                zipCode: data.zipCode,
            },
        });

        return user;
    }

    async getEmailValidationToken(user: User) {
        if (user.isValidated) {
            throw new BadRequestException('Este email já é verificado');
        }

        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        for (let i = 0; i < 12; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }

        const emailValidation = await this.prismaService.emailValidation.upsert(
            {
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    token,
                },
                update: {
                    token,
                },
            },
        );

        this.nodemailerService.sendEmailValidation(
            user.email,
            emailValidation.token,
            user.fantasyName,
        );
    }

    async validateEmail(token: string) {
        const emailValidation =
            await this.prismaService.emailValidation.findFirst({
                where: { token },
                include: {
                    User: true,
                },
            });

        if (!emailValidation) {
            throw new BadRequestException('Token inválido');
        }

        if (
            new Date() >
            new Date(emailValidation.updatedAt.getTime() + 15 * 60 * 1000)
        ) {
            throw new BadRequestException('Token expirado');
        }

        await this.prismaService.user.update({
            where: { id: emailValidation.userId },
            data: {
                isValidated: true,
            },
        });

        await this.prismaService.emailValidation.delete({
            where: { id: emailValidation.id },
        });
    }
}
