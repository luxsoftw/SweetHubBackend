import { BadRequestException, Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from 'src/validators/schemas/auth/SignUp.schema';

@Injectable()
export class CompaniesService {
    constructor(
        private prismaService: PrismaService,
        private nodemailerService: NodemailerService,
    ) {}

    async findById(id: string): Promise<Omit<Company, 'password'> | null> {
        const company = await this.prismaService.company.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                fantasyName: true,
                email: true,
                cpf: true,
                cnpj: true,
                companyName: true,
                createdAt: true,
                updatedAt: true,
                isValidated: true,
                phone: true,
                name: true,
                Address: true,
            },
        });

        return company;
    }

    async findByEmail(email: string): Promise<Company | null> {
        const company = await this.prismaService.company.findUnique({
            where: {
                email,
            },
        });

        return company;
    }

    async create(data: SignUpDto): Promise<{ message: string }> {
        const company = await this.prismaService.company.create({
            data: {
                email: data.email,
                password: data.password,
                fantasyName: data.fantasyName,
                cpf: data.cpf,
                cnpj: data.cnpj,
                companyName: data.companyName,
                phone: data.phone,
                name: data.name,
            },
        });

        await this.prismaService.address.create({
            data: {
                Company: {
                    connect: {
                        id: company.id,
                    },
                },
                cep: data.cep,
                state: data.state,
                city: data.city,
                neighborhood: data.neighborhood,
                fullAddress: data.fullAddress,
                addressNumber: data.addressNumber,
            },
        });

        await this.getEmailValidationToken(company);

        return {
            message: `Conta criada com sucesso!`,
        };
    }

    async getEmailValidationToken(company: Omit<Company, 'password'>) {
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        for (let i = 0; i < 24; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }

        const emailValidation = await this.prismaService.emailValidation.upsert(
            {
                where: { companyId: company.id },
                create: {
                    companyId: company.id,
                    token,
                },
                update: {
                    token,
                },
            },
        );

        await this.nodemailerService.sendEmailValidation(
            company.email,
            emailValidation.token,
            company.fantasyName,
        );

        return {
            message: `Um email de verificação foi enviado para ${company.email}!`,
        };
    }

    async validateEmail(token: string) {
        const emailValidation =
            await this.prismaService.emailValidation.findFirst({
                where: { token },
                include: {
                    Company: true,
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

        await this.prismaService.company.update({
            where: { id: emailValidation.companyId },
            data: {
                isValidated: true,
            },
        });

        await this.prismaService.emailValidation.delete({
            where: { id: emailValidation.id },
        });

        return {
            message: 'Validação de email realizada com sucesso!',
        };
    }
}
